import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center">
                <AppLogoIcon className="size-8 text-black dark:text-white" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold" style={{ fontFamily: 'Cormorant Garamond, DM Serif Display, serif', letterSpacing: '0.08em' }}>
                    INSPIREWRITE<span className="text-[#C59B27]">.</span>
                </span>
            </div>
        </>
    );
}
