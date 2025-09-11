import React from 'react'
import Hero2 from '../Hero2'
import Features from '../Features'
import HowItWorks from '../HowItWorks'
import DemoWidget2 from '../DemoWidgets2'
import Impact from '../Impact'
import Footer from '../Footer'

const Home = () => {
    return (
        <>
            <div className="min-h-screen bg-white">
                <Hero2 />
                <Features />
                <HowItWorks />
                <DemoWidget2 />
                <Impact />
                <Footer />
            </div>
        </>
    )
}

export default Home