import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import data from '../data/seed.json'; // Keeping for category fallback
import { productService, workshopService, eventService } from '../services/api';

function CategoryDetail() {
    const { categoryId } = useParams();
    const { t } = useTranslation();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get category metadata from seed
    const categoryMetadata = data.categories.find(c => c.id === categoryId);

    useEffect(() => {
        const fetchItems = async () => {
            setLoading(true);
            setError(null);
            try {
                let fetchedData = [];
                switch (categoryId) {
                    case 'products':
                        fetchedData = await productService.getAll();
                        break;
                    case 'workshops':
                        fetchedData = await workshopService.getAll();
                        break;
                    case 'events':
                        fetchedData = await eventService.getAll();
                        break;
                    default:
                        console.warn('Unknown category:', categoryId);
                }
                setItems(fetchedData);
            } catch (err) {
                console.error("Failed to load items", err);
                setError(t('categories.load_error'));
            } finally {
                setLoading(false);
            }
        };

        if (categoryId) {
            fetchItems();
        }
    }, [categoryId, t]);

    if (!categoryMetadata) return <div className="text-center py-20 text-2xl">{t('categories.not_found')}</div>;
    if (loading) return <div className="text-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div></div>;
    if (error) return <div className="text-center py-20 text-red-500">{error}</div>;

    const categoryName = t(`categories.data.${categoryId}.name`, { defaultValue: categoryMetadata.name });
    const categoryDesc = t(`categories.data.${categoryId}.description`, { defaultValue: categoryMetadata.description });

    return (
        <div className="container mx-auto px-4 py-8">
            <header className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">
                    <span aria-hidden="true">{categoryMetadata.icon}</span> {categoryName}
                </h1>
                <p className="text-xl text-gray-600">{categoryDesc}</p>
            </header>

            <section aria-labelledby="category-items-heading">
                <h2 id="category-items-heading" className="sr-only">{t('categories.title')} {categoryName}</h2>
                <div className="grid md:grid-cols-3 gap-6">
                    {items.map(item => (
                        <article key={item.id} className="card-eco">
                            <img
                                src={item.image}
                                alt={`${item.name} - ${item.description || categoryName}`}
                                className="w-full h-48 object-cover rounded-t-lg mb-4"
                            />
                            <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                            <p className="text-eco-green font-bold mb-2">${item.price}</p>
                            {item.description && (
                                <p className="text-gray-600 mb-4 text-sm line-clamp-3">
                                    {t(`data_descriptions.${item.id}`, { defaultValue: item.description })}
                                </p>
                            )}
                            <Link
                                to={`/item/${item.id}`}
                                className="btn-eco w-full block text-center"
                                aria-label={`${t('categories.view_details')} ${item.name}`}
                            >
                                {t('categories.view_details')}
                            </Link>
                        </article>
                    ))}
                </div>
            </section >

            {
                items.length === 0 && (
                    <p className="text-center text-gray-500" role="status">
                        {t('categories.no_items')}
                    </p>
                )
            }
        </div >
    );
}

export default CategoryDetail;
