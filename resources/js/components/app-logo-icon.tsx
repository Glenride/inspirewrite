import { SVGAttributes } from 'react';

// The Illuminated Spine: gold lamp spark above a fountain-nib I,
// rising from the W of open scripture. Strokes follow currentColor
// so the mark adapts to light/dark surfaces; the spark stays gold.
export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 200 176" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="InspireWrite">
            <polygon points="100,8 112,20 100,32 88,20" fill="#C59B27" />
            <polyline
                points="92,122 92,64 100,40 108,64 108,122"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <line x1="100" y1="64" x2="100" y2="98" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            <circle cx="100" cy="102" r="3" fill="currentColor" />
            <polyline
                points="28,100 52,156 100,112 148,156 172,100"
                fill="none"
                stroke="currentColor"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
