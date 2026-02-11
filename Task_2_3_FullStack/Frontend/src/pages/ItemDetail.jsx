import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { itemService, reviewService } from '../services/api';

function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { user } = useAuth();
  const { addToCart } = useApp();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [reviews, setReviews] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchItemAndReviews = async () => {
      setLoading(true);
      try {
        const allData = await itemService.getAllItems();
        const allItems = allData.all || [...allData.products, ...allData.workshops, ...allData.events];

        // eslint-disable-next-line eqeqeq
        const found = allItems.find(i => i.id == id);

        if (found) {
          setItem(found);
          try {
            // Fetch Reviews
            const itemReviews = await reviewService.getByItem(found.id);
            setReviews(itemReviews);
          } catch (reviewErr) {
            console.error("Failed to load reviews", reviewErr);
          }
        } else {
          setError(t('item.not_found'));
        }
      } catch (err) {
        console.error("Failed to fetch item details", err);
        setError(t('item.load_error'));
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchItemAndReviews();
    }
  }, [id, t]);

  const handleAction = () => {
    if (item.type === 'product') {
      addToCart(item);
      navigate('/cart');
    } else {
      if (user) {
        navigate(`/booking/${item.id}`);
      } else {
        navigate('/login', { state: { from: location } });
      }
    }
  };

  const handlePostReview = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      const reviewData = {
        itemId: item.id,
        itemType: item.type.charAt(0).toUpperCase() + item.type.slice(1), // Capitalize first letter
        rating: rating,
        comment: newComment
      };

      const savedReview = await reviewService.create(reviewData);
      // Manually attach user name for immediate display since backend might return ID or object
      savedReview.user = { name: user.name };

      setReviews([savedReview, ...reviews]);
      setNewComment('');
      alert(t('item.review_success') || 'Review posted!');
    } catch (err) {
      console.error("Failed to post review", err);
      alert('Failed to post review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div></div>;
  if (error || !item) return <div className="text-center py-20 text-red-500">{error || t('item.not_found')}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        {/* Image */}
        <div>
          <img
            src={item.image}
            alt={item.name}
            className="w-full rounded-lg shadow-lg"
          />
        </div>

        {/* Details */}
        <div>
          <h1 className="text-4xl font-bold mb-4">{item.name}</h1>
          <p className="text-2xl text-eco-green font-bold mb-4">
            ${item.price}
          </p>
          <p className="text-gray-700 mb-6">
            {t(`data_descriptions.${item.id}`, { defaultValue: item.description })}
          </p>

          {item.type === 'workshop' && (
            <div className="mb-6">
              <p>📅 {item.date}</p>
              <p>🕐 {item.time}</p>
              <p>👥 {t('item.enrolled', { enrolled: item.enrolled, capacity: item.capacity })}</p>
            </div>
          )}

          <button
            onClick={handleAction}
            className="btn-eco"
            aria-label={item.type === 'product' ? `${t('item.add_to_cart')} ${item.name}` : `${t('item.register_now')} ${item.name}`}
          >
            {item.type === 'product' ? t('item.add_to_cart') : t('item.register_now')}
          </button>
        </div>
      </div>

      {/* Reviews Section */}
      <section className="max-w-4xl mx-auto" aria-labelledby="reviews-heading">
        <h2 id="reviews-heading" className="text-2xl font-bold mb-6">{t('item.reviews')}</h2>

        {/* Review Form */}
        <div className="bg-gray-50 p-6 rounded-xl mb-8">
          {user ? (
            <form onSubmit={handlePostReview} aria-label="Submit a review">
              <div className="mb-4">
                <label className="block font-semibold mb-2">Rating</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="p-2 border rounded"
                >
                  <option value="5">5 - Excellent</option>
                  <option value="4">4 - Good</option>
                  <option value="3">3 - Average</option>
                  <option value="2">2 - Poor</option>
                  <option value="1">1 - Terrible</option>
                </select>
              </div>
              <label htmlFor="review-comment" className="block font-semibold mb-2">{t('item.leave_review', { name: user.name })}</label>
              <textarea
                id="review-comment"
                className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none mb-4"
                rows="3"
                placeholder={t('item.placeholder')}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                required
                aria-required="true"
              ></textarea>
              <button type="submit" disabled={submitting} className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-black transition-colors disabled:opacity-50">
                {submitting ? 'Posting...' : t('item.post_review')}
              </button>
            </form>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-600 mb-4">{t('item.logged_out_review')}</p>
              <button
                onClick={() => navigate('/login', { state: { from: location } })}
                className="text-green-600 font-bold hover:underline"
              >
                {t('item.login_to_review')}
              </button>
            </div>
          )}
        </div>

        {/* Reviews List */}
        <div className="space-y-6" role="list" aria-label="Customer reviews">
          {reviews.length === 0 && <p className="text-gray-500 italic">No reviews yet. Be the first to share your thoughts!</p>}
          {reviews.map(review => (
            <article key={review.id || review._id} className="border-b border-gray-100 pb-6" role="listitem">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold mr-3">
                  {/* Handle both populated user object and simple string/missing user */}
                  {review.user?.name ? review.user.name[0] : (typeof review.user === 'string' ? review.user[0] : '?')}
                </div>
                <span className="font-bold mr-2">
                  {review.user?.name || (typeof review.user === 'string' ? review.user : 'Anonymous')}
                </span>
                <span className="text-yellow-400">{'★'.repeat(review.rating || 5)}</span>
              </div>
              <p className="text-gray-600 ml-11">{review.comment}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default ItemDetail;
