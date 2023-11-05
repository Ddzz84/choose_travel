export const Rating: React.FC<{
    value: number;
    name: string;
    onChange: (r: number) => void;
}> = ({ value, name, onChange }) => {
    return (
        <div className="rating">
            {[1, 2, 3, 4, 5].map((r) => (
                <input
                    key={`r_${r}`}
                    type="radio"
                    name={name}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => {
                        onChange(r);
                        e.stopPropagation();
                    }}
                    className="mask mask-star-2 bg-orange-400"
                    checked={r === value}
                />
            ))}
        </div>
    );
};
