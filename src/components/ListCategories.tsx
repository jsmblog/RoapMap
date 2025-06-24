import { IonIcon, IonList } from '@ionic/react'
import React from 'react'
import { categories } from '../functions/categories'

const ListCategories:React.FC = () => (
    <div className="categories-overlay">
                <IonList className="list-categories">
                  {categories.map((c) => (
                    <button className="btn-item" key={c.id}>
                      <IonIcon size="small" icon={Object.values(c.icon)[0]} />
                      <h4 className="name-item">{c.name}</h4>
                    </button>
                  ))}
                </IonList>
              </div>
)

export default ListCategories