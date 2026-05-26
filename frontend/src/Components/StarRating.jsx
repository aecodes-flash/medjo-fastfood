const StarRating = ({ rating, setRating }) => {
  return (
    <div className='flex gap-2 justify-center'>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => setRating(star)}
          className={`text-4xl transition duration-150 hover:scale-110
            ${star <= rating ? 'text-yellow-400' : 'text-[#333]'}`}>
          ★
        </button>
      ))}
    </div>
  )
}

export default StarRating