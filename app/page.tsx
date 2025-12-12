import Header from './components/Header';
import Hero from './components/Hero';
import Problem from './components/Problem';
import Question from './components/Question';
import WhatIDo from './components/WhatIDo';
import Proof from './components/Proof';
import Contact from './components/Contact';
import content from '../content/site/site.json';
import styles from './page.module.css';

export default function Home() {
  return (
    <>
      <Header
        name={content.header.name}
        nav={content.header.nav}
        cta={content.header.cta}
      />
      <main className={styles.main}>
        <Hero
          headline={content.hero.headline}
          subline={content.hero.subline}
          image={content.hero.image}
        />
        <Problem
          text={content.problem.text}
          pullquote={content.problem.pullquote}
          image={content.problem.image}
        />
        <Question
          text={content.question.text}
          pullquote={content.question.pullquote}
          image={content.question.image}
        />
        <WhatIDo
          text={content.whatIDo.text}
          pullquote={content.whatIDo.pullquote}
          image={content.whatIDo.image}
        />
        <Proof
          show={content.proof.show}
          items={content.proof.items}
        />
        <Contact
          headline={content.contact.headline}
          text={content.contact.text}
          email={content.contact.email}
          linkedin={content.contact.linkedin}
          image={content.contact.image}
        />
      </main>
    </>
  );
}
