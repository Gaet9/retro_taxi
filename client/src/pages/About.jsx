import { Header } from "../components/Header";
import { Navigation } from "../components/Navigation";
import { Footer } from "@/components/Footer";

export const About = () => {
    return (
        <div className='min-h-screen bg-butter racing-font'>
            <Navigation color='text-purple-950' />
            <Header color='text-purple-950'>About</Header>

            {/* Main Content Container - Wider Layout */}
            <div className='container mx-auto px-4 py-8 max-w-7xl'>
                {/* What Are Autonomous Cars Section */}
                <section className='mb-16'>
                    <h1 className='text-4xl  text-purple-900 mb-8 text-center'>What Are Autonomous Cars?</h1>
                    <div className='bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl shadow-purple-950/20'>
                        <div className='grid lg:grid-cols-2 gap-8 items-center'>
                            <div>
                                <h2 className='text-2xl  text-purple-800 mb-4'>The Future of Transportation</h2>
                                <p className='text-lg text-purple-900 leading-relaxed mb-4'>
                                    Autonomous vehicles, also known as self-driving cars, are vehicles capable of sensing their environment
                                    and operating without human input. Using advanced sensors, cameras, radar, and artificial intelligence,
                                    these vehicles can navigate roads, interpret traffic signals, and make driving decisions independently.
                                </p>
                                <p className='text-lg text-purple-900 leading-relaxed mb-4'>
                                    The technology represents a revolutionary shift in transportation, promising to improve road safety,
                                    reduce traffic congestion, and provide mobility solutions for people who cannot drive.
                                </p>
                                <div className='flex flex-wrap gap-3'>
                                    <span className='px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm '>
                                        AI & Machine Learning
                                    </span>
                                    <span className='px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm '>Computer Vision</span>
                                    <span className='px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm '>Sensor Fusion</span>
                                    <span className='px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm '>Safety Systems</span>
                                </div>
                            </div>
                            <div className='bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl p-6'>
                                <h3 className='text-xl  text-purple-800 mb-4'>Key Components</h3>
                                <ul className='space-y-3 text-purple-900'>
                                    <li className='flex items-center'>
                                        <i className='fa-solid fa-camera text-purple-600 mr-3'></i>
                                        High-definition cameras for visual recognition
                                    </li>
                                    <li className='flex items-center'>
                                        <i className='fa-solid fa-satellite-dish text-purple-600 mr-3'></i>
                                        LiDAR sensors for 3D mapping
                                    </li>
                                    <li className='flex items-center'>
                                        <i className='fa-solid fa-brain text-purple-600 mr-3'></i>
                                        AI processors for decision making
                                    </li>
                                    <li className='flex items-center'>
                                        <i className='fa-solid fa-shield-halved text-purple-600 mr-3'></i>
                                        Redundant safety systems
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Educational Videos Section */}
                <section className='mb-16'>
                    <h2 className='text-3xl  text-purple-900 mb-8 text-center'>Learn More About Autonomous Vehicles</h2>
                    <div className='grid lg:grid-cols-2 gap-8'>
                        {/* Video 1 */}
                        <div className='bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-xl shadow-purple-950/20'>
                            <h3 className='text-xl  text-purple-800 mb-4'>How Self-Driving Cars Work</h3>
                            <div className='aspect-video bg-gray-200 rounded-xl mb-4 flex items-center justify-center'>
                                <a href='https://youtu.be/piNab6aZYis' target='_blank' rel='noopener noreferrer'>
                                    <div className='text-center'>
                                        <i className='fa-brands fa-youtube text-4xl text-red-600 mb-2'></i>
                                    </div>
                                </a>
                            </div>
                        </div>
                        {/* Video 2 */}
                        <div className='bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-xl shadow-purple-950/20'>
                            <h3 className='text-xl  text-purple-800 mb-4'>Quick tour with Baidu in Wuhan (China)</h3>
                            <div className='aspect-video bg-gray-200 rounded-xl mb-4 flex items-center justify-center'>
                                <a href='https://youtu.be/FwABzdr5elM' target='_blank' rel='noopener noreferrer'>
                                    <div className='text-center'>
                                        <i className='fa-brands fa-youtube text-4xl text-red-600 mb-2'></i>
                                    </div>
                                </a>
                            </div>
                        </div>
                        {/* Video 3 */}
                        <div className='bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-xl shadow-purple-950/20'>
                            <h3 className='text-xl  text-purple-800 mb-4'>First drive with Waymo in Los Angeles (USA)</h3>
                            <div className='aspect-video bg-gray-200 rounded-xl mb-4 flex items-center justify-center'>
                                <a href='https://youtu.be/JHgr9SgeicM' target='_blank' rel='noopener noreferrer'>
                                    <div className='text-center'>
                                        <i className='fa-brands fa-youtube text-4xl text-red-600 mb-2'></i>
                                    </div>
                                </a>
                            </div>
                        </div>
                        {/* Video 4 */}
                        <div className='bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-xl shadow-purple-950/20'>
                            <h3 className='text-xl  text-purple-800 mb-4'>First drive with Tesla's robot taxi in Austin (USA)</h3>
                            <div className='aspect-video bg-gray-200 rounded-xl mb-4 flex items-center justify-center'>
                                <a href='https://youtu.be/_s-h0YXtF0c' target='_blank' rel='noopener noreferrer'>
                                    <div className='text-center'>
                                        <i className='fa-brands fa-youtube text-4xl text-red-600 mb-2'></i>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Waymo Safety Statistics Section */}
                <section className='mb-16'>
                    <h2 className='text-3xl  text-purple-900 mb-8 text-center'>
                        <a href='https://waymo.com/safety/'>Waymo Safety Performance</a>
                    </h2>
                    <div className='bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl shadow-purple-950/20'>
                        <div className='space-y-6'>
                            {/* Serious Injury Crashes */}
                            <div className='flex items-center space-x-4'>
                                <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0'>
                                    <i className='fa-solid fa-exclamation-triangle text-2xl text-red-600'></i>
                                </div>
                                <div className='flex-1'>
                                    <div className='flex justify-between items-center mb-2'>
                                        <span className='text-purple-800 '>Fewer serious injury or worse crashes</span>
                                        <span className='text-red-600 text-xl'>88%</span>
                                    </div>
                                    <div className='w-full bg-gray-200 rounded-full h-4'>
                                        <div
                                            className='bg-gradient-to-r from-red-500 to-red-600 h-4 rounded-full transition-all duration-1000 ease-out'
                                            style={{ width: "88%" }}></div>
                                    </div>
                                </div>
                            </div>

                            {/* Airbag Deployment Crashes */}
                            <div className='flex items-center space-x-4'>
                                <div className='w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0'>
                                    <i className='fa-solid fa-shield-alt text-2xl text-orange-600'></i>
                                </div>
                                <div className='flex-1'>
                                    <div className='flex justify-between items-center mb-2'>
                                        <span className='text-purple-800 '>Fewer airbag deployment crashes</span>
                                        <span className='text-orange-600  text-xl'>79%</span>
                                    </div>
                                    <div className='w-full bg-gray-200 rounded-full h-4'>
                                        <div
                                            className='bg-gradient-to-r from-orange-500 to-orange-600 h-4 rounded-full transition-all duration-1000 ease-out'
                                            style={{ width: "79%" }}></div>
                                    </div>
                                </div>
                            </div>

                            {/* Injury-Causing Crashes */}
                            <div className='flex items-center space-x-4'>
                                <div className='w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0'>
                                    <i className='fa-solid fa-user-injured text-2xl text-yellow-600'></i>
                                </div>
                                <div className='flex-1'>
                                    <div className='flex justify-between items-center mb-2'>
                                        <span className='text-purple-800 '>Fewer injury-causing crashes</span>
                                        <span className='text-yellow-600  text-xl'>78%</span>
                                    </div>
                                    <div className='w-full bg-gray-200 rounded-full h-4'>
                                        <div
                                            className='bg-gradient-to-r from-yellow-500 to-yellow-600 h-4 rounded-full transition-all duration-1000 ease-out'
                                            style={{ width: "78%" }}></div>
                                    </div>
                                </div>
                            </div>

                            {/* Pedestrian Crashes */}
                            <div className='flex items-center space-x-4'>
                                <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0'>
                                    <i className='fa-solid fa-walking text-2xl text-blue-600'></i>
                                </div>
                                <div className='flex-1'>
                                    <div className='flex justify-between items-center mb-2'>
                                        <span className='text-purple-800 '>Fewer pedestrian crashes with injuries</span>
                                        <span className='text-blue-600  text-xl'>93%</span>
                                    </div>
                                    <div className='w-full bg-gray-200 rounded-full h-4'>
                                        <div
                                            className='bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full transition-all duration-1000 ease-out'
                                            style={{ width: "93%" }}></div>
                                    </div>
                                </div>
                            </div>

                            {/* Cyclist Crashes */}
                            <div className='flex items-center space-x-4'>
                                <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0'>
                                    <i className='fa-solid fa-bicycle text-2xl text-green-600'></i>
                                </div>
                                <div className='flex-1'>
                                    <div className='flex justify-between items-center mb-2'>
                                        <span className='text-purple-800 '>Fewer cyclist crashes with injuries</span>
                                        <span className='text-green-600  text-xl'>81%</span>
                                    </div>
                                    <div className='w-full bg-gray-200 rounded-full h-4'>
                                        <div
                                            className='bg-gradient-to-r from-green-500 to-green-600 h-4 rounded-full transition-all duration-1000 ease-out'
                                            style={{ width: "81%" }}></div>
                                    </div>
                                </div>
                            </div>

                            {/* Motorcycle Crashes */}
                            <div className='flex items-center space-x-4'>
                                <div className='w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0'>
                                    <i className='fa-solid fa-motorcycle text-2xl text-purple-600'></i>
                                </div>
                                <div className='flex-1'>
                                    <div className='flex justify-between items-center mb-2'>
                                        <span className='text-purple-800 '>Fewer motorcycle crashes with injuries</span>
                                        <span className='text-purple-600  text-xl'>86%</span>
                                    </div>
                                    <div className='w-full bg-gray-200 rounded-full h-4'>
                                        <div
                                            className='bg-gradient-to-r from-purple-500 to-purple-600 h-4 rounded-full transition-all duration-1000 ease-out'
                                            style={{ width: "86%" }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Levels of Autonomy Section */}
                <section className='mb-16'>
                    <h2 className='text-3xl  text-purple-900 mb-8 text-center'>Levels of Vehicle Autonomy</h2>
                    <div className='bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl shadow-purple-950/20'>
                        {/* Autonomy Progress Bar */}
                        <div className='mb-8'>
                            <div className='flex justify-between items-center mb-4'>
                                <span className='text-sm  text-purple-700'>Manual Control</span>
                                <span className='text-sm  text-purple-700'>Full Autonomy</span>
                            </div>
                            <div className='w-full bg-gray-200 rounded-full h-3 relative'>
                                <div className='bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-3 rounded-full transition-all duration-1000 ease-out'></div>
                                {/* Level Markers */}
                                <div className='absolute top-0 left-0 w-1 h-3 bg-white rounded-full shadow-sm'></div>
                                <div className='absolute top-0 left-1/5 w-1 h-3 bg-white rounded-full shadow-sm'></div>
                                <div className='absolute top-0 left-2/5 w-1 h-3 bg-white rounded-full shadow-sm'></div>
                                <div className='absolute top-0 left-3/5 w-1 h-3 bg-white rounded-full shadow-sm'></div>
                                <div className='absolute top-0 left-4/5 w-1 h-3 bg-white rounded-full shadow-sm'></div>
                                <div className='absolute top-0 right-0 w-1 h-3 bg-white rounded-full shadow-sm'></div>
                            </div>
                            <div className='flex justify-between text-xs text-purple-600 mt-2'>
                                <span>Level 0</span>
                                <span>Level 1</span>
                                <span>Level 2</span>
                                <span>Level 3</span>
                                <span>Level 4</span>
                                <span>Level 5</span>
                            </div>
                        </div>

                        {/* Autonomy Level Cards */}
                        <div className='grid lg:grid-cols-2 gap-6'>
                            {/* Level 0 */}
                            <div className='bg-red-50 border-l-4 border-red-500 rounded-xl p-6'>
                                <div className='flex items-center mb-3'>
                                    <div className='w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white  text-sm mr-3'>
                                        0
                                    </div>
                                    <h3 className='text-lg  text-red-800'>No Automation</h3>
                                </div>
                                <p className='text-red-700 text-sm leading-relaxed'>
                                    The human driver performs all driving tasks. No autonomous features are present.
                                </p>
                            </div>

                            {/* Level 1 */}
                            <div className='bg-orange-50 border-l-4 border-orange-500 rounded-xl p-6'>
                                <div className='flex items-center mb-3'>
                                    <div className='w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white  text-sm mr-3'>
                                        1
                                    </div>
                                    <h3 className='text-lg  text-orange-800'>Driver Assistance</h3>
                                </div>
                                <p className='text-orange-700 text-sm leading-relaxed'>
                                    Single automated system (e.g., cruise control or lane keeping). Driver remains fully engaged.
                                </p>
                            </div>

                            {/* Level 2 */}
                            <div className='bg-yellow-50 border-l-4 border-yellow-500 rounded-xl p-6'>
                                <div className='flex items-center mb-3'>
                                    <div className='w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white  text-sm mr-3'>
                                        2
                                    </div>
                                    <h3 className='text-lg  text-yellow-800'>Partial Automation</h3>
                                </div>
                                <p className='text-yellow-700 text-sm leading-relaxed'>
                                    Advanced driver assistance systems (ADAS) can control steering and acceleration simultaneously.
                                </p>
                            </div>

                            {/* Level 3 */}
                            <div className='bg-blue-50 border-l-4 border-blue-500 rounded-xl p-6'>
                                <div className='flex items-center mb-3'>
                                    <div className='w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white  text-sm mr-3'>
                                        3
                                    </div>
                                    <h3 className='text-lg  text-blue-800'>Conditional Automation</h3>
                                </div>
                                <p className='text-blue-700 text-sm leading-relaxed'>
                                    Vehicle can handle all aspects of driving in certain conditions. Driver must be ready to take control.
                                </p>
                            </div>

                            {/* Level 4 */}
                            <div className='bg-green-50 border-l-4 border-green-500 rounded-xl p-6'>
                                <div className='flex items-center mb-3'>
                                    <div className='w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white  text-sm mr-3'>
                                        4
                                    </div>
                                    <h3 className='text-lg  text-green-800'>High Automation</h3>
                                </div>
                                <p className='text-green-700 text-sm leading-relaxed'>
                                    Vehicle operates independently in most conditions. Human intervention may be required in complex
                                    situations.
                                </p>
                            </div>

                            {/* Level 5 */}
                            <div className='bg-emerald-50 border-l-4 border-emerald-500 rounded-xl p-6'>
                                <div className='flex items-center mb-3'>
                                    <div className='w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white  text-sm mr-3'>
                                        5
                                    </div>
                                    <h3 className='text-lg  text-emerald-800'>Full Automation</h3>
                                </div>
                                <p className='text-emerald-700 text-sm leading-relaxed'>
                                    Complete autonomy in all conditions. No human driver required. Vehicle handles all driving scenarios.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Timeline of Technological Development */}
                <section className='mb-16'>
                    <h2 className='text-3xl  text-purple-900 mb-8 text-center'>Timeline of Autonomous Vehicle Development</h2>
                    <div className='bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl shadow-purple-950/20'>
                        <div className='relative'>
                            {/* Timeline Line */}
                            <div className='absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-400 to-blue-400'></div>

                            {/* Timeline Items */}
                            <div className='space-y-8'>
                                <div className='relative flex items-start'>
                                    <div className='absolute left-6 w-4 h-4 bg-purple-600 rounded-full border-4 border-white shadow-lg'></div>
                                    <div className='ml-16'>
                                        <div className='bg-purple-100 rounded-2xl p-6 shadow-lg'>
                                            <h3 className='text-xl  text-purple-900 mb-2'>1920s - Early Concepts</h3>
                                            <p className='text-purple-800'>
                                                The first concepts of automated vehicles emerged, with radio-controlled cars and early
                                                experiments in automated driving systems.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className='relative flex items-start'>
                                    <div className='absolute left-6 w-4 h-4 bg-purple-600 rounded-full border-4 border-white shadow-lg'></div>
                                    <div className='ml-16'>
                                        <div className='bg-purple-100 rounded-2xl p-6 shadow-lg'>
                                            <h3 className='text-xl  text-purple-900 mb-2'>1980s - DARPA Challenges</h3>
                                            <p className='text-purple-800'>
                                                The Defense Advanced Research Projects Agency (DARPA) began funding autonomous vehicle
                                                research, leading to significant breakthroughs in computer vision and robotics.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className='relative flex items-start'>
                                    <div className='absolute left-6 w-4 h-4 bg-purple-600 rounded-full border-4 border-white shadow-lg'></div>
                                    <div className='ml-16'>
                                        <div className='bg-purple-100 rounded-2xl p-6 shadow-lg'>
                                            <h3 className='text-xl  text-purple-900 mb-2'>2004-2007 - DARPA Grand Challenge</h3>
                                            <p className='text-purple-800'>
                                                The DARPA Grand Challenge competitions pushed teams to develop autonomous vehicles capable
                                                of navigating complex desert and urban environments.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className='relative flex items-start'>
                                    <div className='absolute left-6 w-4 h-4 bg-purple-600 rounded-full border-4 border-white shadow-lg'></div>
                                    <div className='ml-16'>
                                        <div className='bg-purple-100 rounded-2xl p-6 shadow-lg'>
                                            <h3 className='text-xl  text-purple-900 mb-2'>2009-2016 - Google's Waymo</h3>
                                            <p className='text-purple-800'>
                                                Google launched its autonomous vehicle project, later becoming Waymo, and began testing
                                                self-driving cars on public roads in California.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className='relative flex items-start'>
                                    <div className='absolute left-6 w-4 h-4 bg-purple-600 rounded-full border-4 border-white shadow-lg'></div>
                                    <div className='ml-16'>
                                        <div className='bg-purple-100 rounded-2xl p-6 shadow-lg'>
                                            <h3 className='text-xl  text-purple-900 mb-2'>2015-2020 - Industry Expansion</h3>
                                            <p className='text-purple-800'>
                                                Major automakers and tech companies entered the autonomous vehicle space, with Tesla, Uber,
                                                and traditional car manufacturers developing their own systems.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className='relative flex items-start'>
                                    <div className='absolute left-6 w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg'></div>
                                    <div className='ml-16'>
                                        <div className='bg-blue-100 rounded-2xl p-6 shadow-lg'>
                                            <h3 className='text-xl  text-blue-900 mb-2'>2020-Present - Commercial Deployment</h3>
                                            <p className='text-blue-800'>
                                                Autonomous vehicles are now being deployed commercially in limited areas, with robotaxis
                                                operating in cities like San Francisco, Phoenix, and Las Vegas.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Current State and Future */}
                <section className='mb-16'>
                    <h2 className='text-3xl  text-purple-900 mb-8 text-center'>Current State & Future Outlook</h2>
                    <div className='grid lg:grid-cols-3 gap-6'>
                        <div className='bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-xl shadow-purple-950/20 text-center'>
                            <div className='w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                                <i className='fa-solid fa-car text-2xl text-purple-600'></i>
                            </div>
                            <h3 className='text-xl  text-purple-800 mb-3'>Current Technology</h3>
                            <p className='text-purple-900'>
                                Level 4 autonomy achieved in controlled environments, with extensive testing ongoing in urban areas
                                worldwide.
                            </p>
                        </div>

                        <div className='bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-xl shadow-purple-950/20 text-center'>
                            <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                                <i className='fa-solid fa-road text-2xl text-blue-600'></i>
                            </div>
                            <h3 className='text-xl  text-blue-800 mb-3'>Regulatory Progress</h3>
                            <p className='text-blue-900'>
                                Governments worldwide are developing frameworks for autonomous vehicle deployment, with safety standards and
                                testing protocols being established.
                            </p>
                        </div>

                        <div className='bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-xl shadow-purple-950/20 text-center'>
                            <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                                <i className='fa-solid fa-rocket text-2xl text-green-600'></i>
                            </div>
                            <h3 className='text-xl  text-green-800 mb-3'>Future Vision</h3>
                            <p className='text-purple-900'>
                                By 2030, autonomous vehicles could transform urban mobility, reduce accidents by 90%, and create new
                                transportation-as-a-service models.
                            </p>
                        </div>
                    </div>
                </section>
            </div>

            <Footer />
        </div>
    );
};
