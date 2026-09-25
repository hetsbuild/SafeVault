import { Link } from "react-router-dom";

export default function LandingPage() {
    return (
        <>
            <div id="home" className="relative flex size-full min-h-screen flex-col bg-slate-50 group/design-root overflow-x-hidden" style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}>
                <div className="layout-container flex h-full grow flex-col">
                    <header className="fixed  w-full top-0 z-50 bg-white flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#e7edf4] px-10 py-3">
                        <div className="flex items-center gap-4 text-[#0d151c]">
                            <div className="size-4">
                                <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z"
                                        fill="currentColor"
                                    ></path>
                                </svg>
                            </div>
                            <h2 className="text-[#0d151c] text-lg font-bold leading-tight tracking-[-0.015em]">SafeVault</h2>
                        </div>
                        <div className="flex flex-1 justify-end gap-5">
                            <div className="flex items-center gap-9">
                                <a className="text-[#0d151c] text-sm font-medium leading-normal" href="#home">Home</a>
                                <a className="text-[#0d151c] text-sm font-medium leading-normal" href="#features">Features</a>
                                <a className="text-[#0d151c] text-sm font-medium leading-normal" href="#works">How It Works</a>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#0b80ee] text-slate-50 text-sm font-bold leading-normal tracking-[0.015em]"
                                >

                                    <Link to={"/login"}>
                                        <span className="truncate">Log In</span>
                                    </Link>

                                </button>
                                <button
                                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#e7edf4] text-[#0d151c] text-sm font-bold leading-normal tracking-[0.015em]"
                                >
                                    <Link to="/signup">
                                        <span className="truncate">Sign Up</span>
                                    </Link>
                                </button>
                            </div>
                        </div>
                    </header>
                    <div className="px-40 flex flex-1 justify-center py-5 mt-10" >
                        <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
                            <div className="@container" >
                                <div className="flex flex-col gap-6 px-4 py-10 @[480px]:gap-8 @[864px]:flex-row">
                                    <div
                                        className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl @[480px]:h-auto @[480px]:min-w-[400px] @[864px]:w-full"
                                        style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAU0Qaw6y0pi6R421L4jzFz-8nCg9MBRJTOvpU3Hf5KF3SjzPw5uXYcuVcDhk571I69XsESvUyFlEYy9z-9K3FllBg_0-rXq6kgxHlSah1A1_GdpQqDBbVJDpUFBl2m1hTOE8UmBoro6RPwEwr6H7KIR5-CCd_4ozj_7nPP91gIg5C3G55JQKAwZP37iIslVhrSjcgWLrdwTmV_Xe_PvUdhqDqNBuKlvnIu0B0GAdM1aHZZpriXGxFkyHhFUdR5H5CI57Jw4j4muk8")' }}
                                    ></div>
                                    <div className="flex flex-col gap-6 @[480px]:min-w-[400px] @[480px]:gap-8 @[864px]:justify-center">
                                        <div className="flex flex-col gap-2 text-left">
                                            <h1
                                                className="text-[#0d151c] text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em]"
                                            >
                                                Your Private Vault. Secured by Your Face.
                                            </h1>
                                            <h2 className="text-[#0d151c] text-sm font-normal leading-normal @[480px]:text-base @[480px]:font-normal @[480px]:leading-normal">
                                                SafeVault provides secure and reliable cloud storage solutions for individuals and businesses. Protect your data with advanced security features and access it
                                                from anywhere.
                                            </h2>
                                        </div>
                                        <div className="flex-wrap gap-3 flex">
                                            <button
                                                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-[#0b80ee] text-slate-50 text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em]"
                                            >
                                                <Link to="/login"><span className="truncate">Get Started</span></Link>
                                            </button>

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-10 px-4 py-10 @container" id="features">
                                <div className="flex flex-col gap-4">
                                    <h1
                                        className="text-[#0d151c] tracking-light text-[32px] font-bold leading-tight @[480px]:text-4xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em] max-w-[720px]"
                                    >
                                        Key Features
                                    </h1>
                                    <p className="text-[#0d151c] text-base font-normal leading-normal max-w-[720px]">SafeVault offers a range of features to ensure your data is safe and accessible.</p>
                                </div>
                                <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-3">
                                    <div className="flex flex-col gap-3 pb-3">
                                        <div
                                            className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
                                            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAOYuENUujtnDL1OqDfzI1BNfghGREN5ETiae1duu1tOD12fymoHTM4DPBztOf38aUnseWKGzd4qikGPuFYoRn9kMP8Cj6p3CZfA4oZWCknfH2yFi8lFkxZh5Zqi9g51QheZg5ggCxmE0j9P9nGlYVhKhCkUK2awTYRwty1Lj-jPgFyIX6KsusZ91xt5lxojWqR3IhbLHW8joeO9uy_7dbMogpujPKCRruBraRwOxK2-ebDHW_VidGoYqaiB0AUEBT7T1hepQvlm0c")' }}
                                        ></div>
                                        <div>
                                            <p className="text-[#0d151c] text-base font-medium leading-normal">End-to-End AES Encryption</p>
                                            <p className="text-[#49749c] text-sm font-normal leading-normal">Store your files securely in the cloud with end-to-end encryption.</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-3 pb-3">
                                        <div
                                            className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
                                            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuABevb-SafQkR2nMndwmTM3raEh8p5kAyf4EBaWaRFLzLJSTpqNdiqQ3jXoOIZlF-cV3yZXiSNRUiMyurZy2LSJbZyo-zSDvT0AcxtDpUSbzmZmJ4OHYK3HYeOa4R4auykPrnkAt20CwIRKCBgKEXdaKTjMW1_ocp1_kMgS7stH090VlVk9FDB5tbP8-hYewHUYm5ryZflwLiVQb0yp-sYl7RAbnrE9Qx-RX5M5UbbEIY7KsnQ95bGaICXGUWsJmfqrnMWpXJfpX-I")' }}
                                        ></div>
                                        <div>
                                            <p className="text-[#0d151c] text-base font-medium leading-normal">Facial Biometric Authentication</p>
                                            <p className="text-[#49749c] text-sm font-normal leading-normal">Protect your data with face detection security and multi-factor authentication.</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-3 pb-3">
                                        <div
                                            className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
                                            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBmwh0K6GfmtCOhs0o4u1GElrFd6HpdorWUTSGHwvMNY_tTFn7iidGMUXvFOqIbhAPvpchc1V86UAbIhdXRBBHdVNNZYY8OfWwMnRMQy-rnwBRbnSTizBsGUSmSSOqZd9vGkDbJ6mgGYYZta5pi9oFKY6BiV8OyLlq9WH0u-VUqeujiGkOViclgMIjXXDZKCHky-EUEi9iQD9lhkfq3IkAhgMUcAz70_65tVo02cheHvL1pSQkIa_VojtliJTIIxMfTD-9-XrzyMYk")' }}
                                        ></div>
                                        <div>
                                            <p className="text-[#0d151c] text-base font-medium leading-normal"> Cloud Backup</p>
                                            <p className="text-[#49749c] text-sm font-normal leading-normal">Backup your data to the cloud for added security and peace of mind.</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-3 pb-3">
                                        <div
                                            className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
                                            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAPTD_iPEHsuWlWkh3eKxeq0oqRLFTIdNHL5y9wLikaURc3cwdmg-UO5ZoujJWRZ78ZtCrU3Er87SFh95uw6M4ByXhC0Wc11HHugme-encb18wJJY8J7CBfMmebLR0tOTHG7lUxZsFn6brDIUTtQ9vWvZXPAmiXtDYX58wM1otLiWlCxEoGTnj64AXpF87pB8QGSOtgG6TaAzs5qKnztwvQSdriUKOg-i6rlOUs9J8MFI9WnJGz5GV-K4QJJFkrH6zZffySa_IIWT8")' }}
                                        ></div>
                                        <div>
                                            <p className="text-[#0d151c] text-base font-medium leading-normal">Personal &amp; Private access control</p>
                                            <p className="text-[#49749c] text-sm font-normal leading-normal">Control who has access to your data with personal and private access settings.</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-3 pb-3">
                                        <div
                                            className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
                                            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBt1R88uEBCS4D5VjcUR2I4fWCilAhcBFA2hc454lG5a56Jux4yaUe4sR04K72JJlMivSYUrnurOM1Jy-m8e7G0pI7BIueNz_eeWYqAvaFjo5Tu-gvng1bHdjZB_Szx2uzyC7_oyFNsX6W0CtHvAYEflyA5r0dskgOZD5XyLsYcFV72iUYhGNomqJTYXTovQ3qaD31nF2FsohcGboA421Aekzn86LZoHreyi4IcO0-PeXXwjgKJrmnH_pgCJWalg8WIUTzFAcExuUU")' }}
                                        ></div>
                                        <div>
                                            <p className="text-[#0d151c] text-base font-medium leading-normal">Auto-lock and session timeout</p>
                                            <p className="text-[#49749c] text-sm font-normal leading-normal">Automatically lock your account and timeout sessions for enhanced security.</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-3 pb-3">
                                        <div
                                            className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
                                            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAVrtvorm7zjSm2i2CT19d33GD2qnGDbIBFKZHWrwVLsRewIwRKNpCB7jO-w4Szy1HH43J10_GZYf7uad0jc8WiZ4-MbOpDkpphzmzy6S48aKjje3OEdo1YZBcDR_u3dwT5iGnWQzy7W37uvy9d6HV8tuEmKBmkh870OAVEG6XmmaFSDDwUL7aJhTWj6HpSJNmDrvLFiPs2lNRK2kB-aYz1Oy1GNNeZcDuFnrjXVS5gdl1cvsrPKjbRA2AY-MhH7AGGzhO3_JddAXg")' }}
                                        ></div>
                                        <div>
                                            <p className="text-[#0d151c] text-base font-medium leading-normal">Compatibility Across All Devices</p>
                                            <p className="text-[#49749c] text-sm font-normal leading-normal">Access your files from any device, anytime, with our user-friendly interface.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-10 px-4 py-10 @container" id="works">
                                <div className="flex flex-col gap-4">
                                    <h1
                                        className="text-[#0d151c] tracking-light text-[32px] font-bold leading-tight @[480px]:text-4xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em] max-w-[720px]"
                                    >
                                        How It Works
                                    </h1>
                                    <p className="text-[#0d151c] text-base font-normal leading-normal max-w-[720px]">SafeVault makes it easy to securely store and access your notes.</p>
                                </div>
                                <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-0">
                                    <div className="flex flex-1 gap-3 rounded-lg border border-[#cedce8] bg-slate-50 p-4 flex-col">
                                        <div className="text-[#0d151c]" data-icon="User" data-size="24px" data-weight="regular">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                                                <path
                                                    d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"
                                                ></path>
                                            </svg>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <h2 className="text-[#0d151c] text-base font-bold leading-tight">Sign up &amp; Train Your Face</h2>
                                            <p className="text-[#49749c] text-sm font-normal leading-normal">Create an account and train the app to recognize your face for secure access.</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-1 gap-3 rounded-lg border border-[#cedce8] bg-slate-50 p-4 flex-col">
                                        <div className="text-[#0d151c]" data-icon="Note" data-size="24px" data-weight="regular">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                                                <path
                                                    d="M88,96a8,8,0,0,1,8-8h64a8,8,0,0,1,0,16H96A8,8,0,0,1,88,96Zm8,40h64a8,8,0,0,0,0-16H96a8,8,0,0,0,0,16Zm32,16H96a8,8,0,0,0,0,16h32a8,8,0,0,0,0-16ZM224,48V156.69A15.86,15.86,0,0,1,219.31,168L168,219.31A15.86,15.86,0,0,1,156.69,224H48a16,16,0,0,1-16-16V48A16,16,0,0,1,48,32H208A16,16,0,0,1,224,48ZM48,208H152V160a8,8,0,0,1,8-8h48V48H48Zm120-40v28.7L196.69,168Z"
                                                ></path>
                                            </svg>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <h2 className="text-[#0d151c] text-base font-bold leading-tight">Create Encrypted Notes</h2>
                                            <p className="text-[#49749c] text-sm font-normal leading-normal">Write and save your notes with end-to-end encryption for maximum privacy.</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-1 gap-3 rounded-lg border border-[#cedce8] bg-slate-50 p-4 flex-col">
                                        <div className="text-[#0d151c]" data-icon="Smiley" data-size="24px" data-weight="regular">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                                                <path
                                                    d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,176,108Zm-1.07,48c-10.29,17.79-27.4,28-46.93,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.07-20a8,8,0,0,1,13.86,8Z"
                                                ></path>
                                            </svg>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <h2 className="text-[#0d151c] text-base font-bold leading-tight">Unlock &amp; Read Notes</h2>
                                            <p className="text-[#49749c] text-sm font-normal leading-normal">Use face recognition to unlock your notes and read them securely.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <footer className=" text-[#0d151c] tracking-light text-[32px] font-bold leading-tight  py-12 px-6">
                                <div className="max-w-4xl mx-auto text-center">
                                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                        Your Mind is Private. Keep it That Way.
                                    </h2>
                                    <p className="text-gray-400 text-lg mb-6">
                                        Start using SafeVault today to secure your thoughts with military-grade encryption and facial recognition.
                                    </p>
                                    <Link
                                        to="/signup"
                                        className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-semibold px-6 py-3 rounded-full shadow transition duration-300"
                                    >
                                        🔐 Get Started
                                    </Link>
                                    <p className="text-gray-500 text-sm mt-6">
                                        Already have an account? <Link to="/login" className="text-indigo-400 hover:underline">Log in here</Link>
                                    </p>
                                </div>
                            </footer>


                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}
