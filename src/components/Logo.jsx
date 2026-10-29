export const Logo = ({ size = "36px" }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            width={size}
            height={size}
            style={{ display: 'block', flexShrink: 0 }}
        >
            <polygon
                points="50,3 95,27 95,73 50,97 5,73 5,27"
                fill="var(--tactical-panel)"
                stroke="var(--tactical-border-hover)"
                strokeWidth="4"
            />

            <polygon
                points="50,10 88,30 88,70 50,90 12,70 12,30"
                fill="none"
                stroke="var(--tactical-accent)"
                strokeWidth="2"
                strokeDasharray="4 2"
                opacity="0.7"
            />

            <polygon
                points="50,30 22,72 78,72"
                fill="#1b241e"
                stroke="var(--tactical-border-hover)"
                strokeWidth="3"
                strokeLinejoin="round"
            />

            <polygon
                points="50,42 32,72 68,72"
                fill="#111827"
                stroke="var(--tactical-border-hover)"
                strokeWidth="2"
            />

            <polygon
                points="50,42 43,62 57,62"
                fill="var(--tactical-accent)"
            />
        </svg>
    );
};