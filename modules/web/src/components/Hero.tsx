import { Link } from "react-router-dom"
import { Button } from "./ui/button"
import HeroImg from "./HeroImg"
import {ReactTyped} from 'react-typed'


const Hero = () => {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
      <div>
        <h1 className="max-w-2xl font-bold text-3xl lg:text-4xl tracking-tight capitalize sm:text-6xl">
          Your{' '}
          <ReactTyped strings={['AI-Based Symptom Checker']} typeSpeed={100} />
        </h1>
        <HeroImg divclasses="lg:hidden"/>
        <p className="mt-8 max-w-xl text-lg leading-8">
          Interact with a medical AI assistant and get
          quick feedback on your health as soon as possible.
        </p>
        <Button asChild size="lg" className="mt-10 rounded-lg bg-purple-500 text-foreground">
          <Link to="/dashboard" className="uppercase text-xl tracking-wider">
            Get Started
          </Link>
        </Button>
      </div>
      <HeroImg divclasses="hidden lg:block"/>
    </section>
  )
}

export default Hero
