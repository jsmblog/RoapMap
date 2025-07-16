import {
    IonCard,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonText,
} from "@ionic/react";
import { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import '../styles/achievementPopup.css';
import { useAuthContext } from '../context/UserContext';
import { achievements } from '../functions/achievements';
import { db } from '../Firebase/initializeApp';

type AchievementKey = keyof typeof achievements;

export const useAchievements = () => {
    const { authUser, currentUserData } = useAuthContext();
    const [localUnlocked, setLocalUnlocked] = useState<AchievementKey[]>([]);
    const [showAchievement, setShowAchievement] = useState(false);
    const [unlockedData, setUnlockedData] = useState<{
        title: string;
        description: string;
        points: number;
    } | null>(null);

    const unlockAchievement = async (key: AchievementKey) => {
        if (!authUser || !currentUserData) return;

        const alreadyUnlocked =
            currentUserData.achievements?.includes(key) ||
            localUnlocked.includes(key);

        if (alreadyUnlocked) return;

        const achievement = achievements[key];
        if (!achievement) return;

        const updatedAchievements = [
            ...(currentUserData.achievements || []),
            key,
        ];

        const newPoints = (currentUserData.points || 0) + achievement.points;

        try {
            await setDoc(
                doc(db, 'USERS', authUser.uid),
                {
                    ach: updatedAchievements,
                    pt: newPoints,
                },
                { merge: true }
            );
        } catch (err) {
            console.error("Error al guardar el logro:", err);
            return;
        }

        setLocalUnlocked((prev) => [...prev, key]);
        setUnlockedData({
            title: achievement.title,
            description: achievement.description,
            points: achievement.points,
        });
        setShowAchievement(true);

        setTimeout(() => {
            setShowAchievement(false);
            setUnlockedData(null);
        }, 6000);
    };

    const isAchievementUnlocked = (key: AchievementKey): boolean => {
        return (
            currentUserData?.achievements?.includes(key) ||
            localUnlocked.includes(key)
        );
    };

    const AchievementPopup = showAchievement && unlockedData ? (
        <IonCard className="achievement-popup">
            <IonCardHeader>
                <IonCardTitle className="achievement-title">🎉 {unlockedData.title}</IonCardTitle>
                <IonCardSubtitle className="achievement-description">
                    {unlockedData.description}
                </IonCardSubtitle>
            </IonCardHeader>
            <IonText className="achievement-points">
                +{unlockedData.points} puntos
            </IonText>
        </IonCard>
    ) : null;

    return {
        unlockAchievement,
        isAchievementUnlocked,
        unlockedAchievements: currentUserData?.achievements || [],
        currentPoints: currentUserData?.points || 0,
        AchievementPopup,
    };
};
