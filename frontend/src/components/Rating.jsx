import { Star, StarHalf } from 'lucide-react';

const Rating = ({ value, text, color }) => {
    return (
        <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((index) => {
                if (value >= index) {
                    return <Star key={index} className={`h-4 w-4 fill-current ${color}`} />;
                } else if (value >= index - 0.5) {
                    return (
                        <div key={index} className="relative">
                            <Star className={`h-4 w-4 ${color}`} />
                            <div className="absolute top-0 left-0 overflow-hidden w-1/2">
                                <Star className={`h-4 w-4 fill-current ${color}`} />
                            </div>
                        </div>
                    );
                } else {
                    return <Star key={index} className={`h-4 w-4 ${color}`} />;
                }
            })}
            {text && <span className="ml-2 text-sm text-gray-500">{text}</span>}
        </div>
    );
};

Rating.defaultProps = {
    color: 'text-yellow-500',
};

export default Rating;
