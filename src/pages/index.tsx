import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import HomepageFeatures from "@site/src/components/HomepageFeatures";
import Heading from "@theme/Heading";
import CodeBlock from "@theme/CodeBlock";

import styles from "./index.module.css";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}

function QuickStart() {
  return (
    <div className={clsx("container", styles.quickStart)}>
      <div className="row">
        <div className={clsx("col col--offset-3 col--6")}>
          <Heading as="h2" className="text--center">
            Up and running in seconds
          </Heading>
          <CodeBlock language="bash">
            {`npx create-xframes-node-app my-app\ncd my-app\nnpm start`}
          </CodeBlock>
        </div>
      </div>
    </div>
  );
}

function LanguageBindings() {
  return (
    <div className={clsx("container", styles.languageBindings)}>
      <div className="row">
        <div className={clsx("col col--offset-3 col--6 text--center")}>
          <p>
            XFrames also has experimental bindings for{" "}
            <Link to="/docs/other-languages">
              25+ other languages
            </Link>{" "}
            via its C API — including Python, Rust, Java, Kotlin, C#, and more.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title} - GPU-accelerated React desktop apps`}
      description="Build GPU-accelerated desktop apps with React and TypeScript — powered by Dear ImGui"
    >
      <HomepageHeader />
      <main>
        <HomepageFeatures className="margin-bottom--xl" />
        <QuickStart />
        <LanguageBindings />
      </main>
    </Layout>
  );
}
