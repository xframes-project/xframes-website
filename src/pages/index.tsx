import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';
import NodejsLogoUrl from '@site/static/img/nodejs.png';
import KotlinLogoUrl from '@site/static/img/kotlin.png';
import PythonLogoUrl from '@site/static/img/python.png';
import JavaLogoUrl from '@site/static/img/java.png';
import ScalaLogoUrl from '@site/static/img/scala.png';
import FSharpLogoUrl from '@site/static/img/fsharp.png';
import WebAssemblyLogoUrl from '@site/static/img/webassembly.png';
// import WebGPULogoUrl from '@site/static/img/webgpu.png';
import CPPLogoUrl from '@site/static/img/cpp.png';
import CLogoUrl from '@site/static/img/c.png';
import CSharpLogoUrl from '@site/static/img/csharp.png';
import AdaLogoUrl from '@site/static/img/ada.png';
import RustLogoUrl from '@site/static/img/rust.png';
import GoLogoUrl from '@site/static/img/go.png';
import TSLogoUrl from '@site/static/img/ts.png';
import SwiftLogoUrl from '@site/static/img/swift.png';
import LuaLogoUrl from '@site/static/img/lua.png';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">Docs</Link>
        </div>
      </div>
    </header>
  );
}

const techs = [
  {name: 'WASM', logoUrl: WebAssemblyLogoUrl},
  {name: 'Node.js', logoUrl: NodejsLogoUrl},
  {name: 'TypeScript', logoUrl: TSLogoUrl},
  {name: 'F#', logoUrl: FSharpLogoUrl},
  {name: 'C#', logoUrl: CSharpLogoUrl},
  {name: 'C', logoUrl: CLogoUrl},
  {name: 'C++', logoUrl: CPPLogoUrl},
  {name: 'Rust', logoUrl: RustLogoUrl},
  {name: 'Go', logoUrl: GoLogoUrl},
  {name: 'Kotlin', logoUrl: KotlinLogoUrl},
  {name: 'Java', logoUrl: JavaLogoUrl},
  {name: 'Scala', logoUrl: ScalaLogoUrl},
  {name: 'Python', logoUrl: PythonLogoUrl},
  {name: 'Swift', logoUrl: SwiftLogoUrl},
  {name: 'Lua', logoUrl: LuaLogoUrl},
  {name: 'Ada', logoUrl: AdaLogoUrl},
];

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title} - open source library for GPU-accelerated GUI development`}
      description="Open source library for GPU-accelerated GUI development for Node.js and the browser">
      <HomepageHeader />
      <main>
        <HomepageFeatures className="margin-bottom--xl" />
        <div className="container">
          <div className="row margin-bottom--sm">
            <div className={clsx('col col--offset-3 col--6')}>
              <h1 className="text--center">Use the tools you love</h1>
              <p className="text--center">Like JavaScript? Go ahead and use it. Prefer Kotlin, Python, or something else? XFrames has you covered with bindings for multiple languages (via a thin C wrapper or via JNI), letting you work with the tools you're most comfortable with.</p>
            </div>
          </div>
          <div className={clsx(styles.techsWrapper)}>
            {techs.map(tech => (<div key={tech.name} className={clsx(styles.techAvatar)}>
              <img src={tech.logoUrl} alt={`${tech.name} logo`} className={clsx('avatar__photo', styles.techAvatarImg)}/>
              <div className="avatar__intro">
                <small className="avatar__subtitle">{tech.name}</small>
              </div>
            </div>))}
          </div>
        </div>
      </main>
    </Layout>
  );
}
