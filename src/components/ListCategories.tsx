import { IonIcon, IonList } from "@ionic/react";
import { categories } from "../functions/categories";
import { ListCategoriesProps } from "../Interfaces/iGoogleMaps";
import { useTranslation } from "react-i18next";

const ListCategories: React.FC<ListCategoriesProps> = ({
  onCategorySelect,
  selectedCategory,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="categories-overlay">
        <IonList className="list-categories">
          {categories.map((c) => {
            const isSelected = selectedCategory === c.place;

            return (
              <button
                className={`btn-item ${isSelected ? "btn-item-selected" : ""}`}
                key={c.id}
                onClick={() => onCategorySelect(isSelected ? null : c.place)}
              >
                <IonIcon size="small" icon={c.icon} />
                <h4 className="name-item">{t(`categories.${c.name}`)}</h4>
              </button>
            );
          })}
        </IonList>
      </div>
    </>
  );
};

export default ListCategories;
