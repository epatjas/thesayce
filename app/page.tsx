import fs from 'fs';
import path from 'path';
import Header from './components/Header';
import Hero from './components/Hero';
import Problem from './components/Problem';
import Question from './components/Question';
import WhatIDo from './components/WhatIDo';
import Proof from './components/Proof';
import Contact from './components/Contact';
import content from '../content/site/site.json';
import styles from './page.module.css';

interface CaseStudyData {
  slug: string;
  published: boolean;
  title: string;
  context?: {
    client?: string;
  };
  preview?: {
    image?: string;
    title?: string;
  };
}

function getCaseStudies(): CaseStudyData[] {
  const caseStudiesDir = path.join(process.cwd(), 'content/case-studies');

  if (!fs.existsSync(caseStudiesDir)) {
    return [];
  }

  const files = fs.readdirSync(caseStudiesDir).filter(f => f.endsWith('.json'));

  return files.map(file => {
    const fileContent = fs.readFileSync(path.join(caseStudiesDir, file), 'utf8');
    return JSON.parse(fileContent) as CaseStudyData;
  });
}

export default function Home() {
  // Get published case studies
  const caseStudies = getCaseStudies().filter(cs => cs.published);

  // Build proof items from case studies
  const proofItems = caseStudies.map(cs => ({
    client: cs.context?.client || '',
    title: cs.preview?.title || cs.title,
    image: cs.preview?.image || '/images/proof-1.jpg',
    slug: cs.slug,
  }));

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
          items={proofItems}
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
