import { FC } from 'react';

// Definición de la interface para el objeto testimony
interface Testimony {
  rating: number;
  name_client: string;
  testimony: string;
  service: string;
}

// Props del componente
interface CardTestimonyProps {
  testimony: Testimony;
}

const CardTestimony: FC<CardTestimonyProps> = ({ testimony }) => {
  const maxRating = 5; // Rating máximo
  
  return (
    <div className="keen-slider__slide">
      <blockquote
        className="flex h-full flex-col justify-between bg-white p-6 shadow-sm sm:p-8 lg:p-12"
      >
        <div>
          <div className="flex gap-0.5 text-green-500">
            {
              Array.from({ length: maxRating }, (_, i) => (
                <svg
                  key={i}
                  className={`h-5 w-5 transition-transform duration-300 ${i < testimony.rating ? 'scale-110' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  />
                </svg>      
              ))
            }
          </div>

          <div className="mt-4">
            <p className="text-2xl font-bold text-rose-600 sm:text-3xl"> {testimony.name_client}</p>

            <p className="mt-4 leading-relaxed text-gray-700">
              {testimony.testimony}
            </p>
          </div>
        </div>

        <footer className="mt-4 text-sm font-medium text-gray-700 sm:mt-6">
          &mdash; {testimony.service}
        </footer>
      </blockquote>
    </div>
  )
}

export default CardTestimony;