import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import HomepageFeatures from "@site/src/components/HomepageFeatures";
import Heading from "@theme/Heading";
import NodejsLogoUrl from "@site/static/img/nodejs.png";
import KotlinLogoUrl from "@site/static/img/kotlin.png";
import PythonLogoUrl from "@site/static/img/python.png";
import JavaLogoUrl from "@site/static/img/java.png";
import ScalaLogoUrl from "@site/static/img/scala.png";
import FSharpLogoUrl from "@site/static/img/fsharp.png";
import WebAssemblyLogoUrl from "@site/static/img/webassembly.png";
import CPPLogoUrl from "@site/static/img/cpp.png";
import CLogoUrl from "@site/static/img/c.png";
import CSharpLogoUrl from "@site/static/img/csharp.png";
import AdaLogoUrl from "@site/static/img/ada.png";
import RustLogoUrl from "@site/static/img/rust.png";
import OCamlLogoUrl from "@site/static/img/ocaml.png";
import TSLogoUrl from "@site/static/img/ts.png";
import SwiftLogoUrl from "@site/static/img/swift.png";
import LuaLogoUrl from "@site/static/img/lua.png";
import CrystalLogoUrl from "@site/static/img/crystal.png";
import DLangLogoUrl from "@site/static/img/dlang.png";
import RubyLogoUrl from "@site/static/img/ruby.png";
import NimLogoUrl from "@site/static/img/nim.png";
import RacketLogoUrl from "@site/static/img/racket.png";
import HaskellLogoUrl from "@site/static/img/haskell.png";
import FreePascalLogoUrl from "@site/static/img/freepascal.png";
import DelphiLogoUrl from "@site/static/img/delphi.png";

await import("prismjs/components/prism-lua");
await import("prismjs/components/prism-scheme");
await import("prismjs/components/prism-racket");
await import("prismjs/components/prism-crystal");

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
            Docs
          </Link>
        </div>
      </div>
    </header>
  );
}

const techs = [
  { name: "WASM", logoUrl: WebAssemblyLogoUrl },
  // {name: 'C', logoUrl: CLogoUrl},
  { name: "C++", logoUrl: CPPLogoUrl },
  // {name: 'Node.js', logoUrl: NodejsLogoUrl},
  { name: "TypeScript", logoUrl: TSLogoUrl },
  { name: "F#", logoUrl: FSharpLogoUrl, githubProjectName: "xframes-fsharp" },
  { name: "C#", logoUrl: CSharpLogoUrl, githubProjectName: "xframes-csharp" },
  // {name: 'Rust', logoUrl: RustLogoUrl},
  {
    name: "Kotlin",
    logoUrl: KotlinLogoUrl,
    githubProjectName: "xframes-kotlin",
  },
  { name: "Java", logoUrl: JavaLogoUrl, githubProjectName: "xframes-java" },
  { name: "Scala", logoUrl: ScalaLogoUrl, githubProjectName: "xframes-scala" },
  {
    name: "Python",
    logoUrl: PythonLogoUrl,
    githubProjectName: "xframes-python",
  },
  // {name: 'Swift', logoUrl: SwiftLogoUrl},
  { name: "Lua", logoUrl: LuaLogoUrl, githubProjectName: "xframes-lua" },
  { name: "Ada", logoUrl: AdaLogoUrl, githubProjectName: "xframes-ada" },
  { name: "OCaml", logoUrl: OCamlLogoUrl, githubProjectName: "xframes-ocaml" },
  {
    name: "Crystal",
    logoUrl: CrystalLogoUrl,
    githubProjectName: "xframes-crystal",
  },
  { name: "D", logoUrl: DLangLogoUrl, githubProjectName: "xframes-dlang" },
  { name: "Nim", logoUrl: NimLogoUrl, githubProjectName: "xframes-nim" },
  { name: "Ruby", logoUrl: RubyLogoUrl, githubProjectName: "xframes-ruby" },
  {
    name: "Racket",
    logoUrl: RacketLogoUrl,
    githubProjectName: "xframes-racket",
  },
  {
    name: "Haskell",
    logoUrl: HaskellLogoUrl,
    githubProjectName: "xframes-haskell",
  },
  {
    name: "Free Pascal",
    logoUrl: FreePascalLogoUrl,
    githubProjectName: "xframes-freepascal",
  },
  {
    name: "Delphi",
    logoUrl: DelphiLogoUrl,
    githubProjectName: "xframes-delphi",
  },
];

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title} - open source library for GPU-accelerated GUI development`}
      description="Open source library for GPU-accelerated GUI development for Node.js and the browser"
    >
      <HomepageHeader />
      <main>
        <HomepageFeatures className="margin-bottom--xl" />
        <div className="container">
          <div className="row margin-bottom--sm">
            <div className={clsx("col col--offset-3 col--6")}>
              <h1 className="text--center">Use the tools you love</h1>
              <p className="text--center">
                Like JavaScript? Go ahead and use it. Prefer Kotlin, Python, or
                something else? XFrames has you covered with bindings for
                multiple languages (via a thin C wrapper or via JNI), letting
                you work with the tools you're most comfortable with.
              </p>
            </div>
          </div>
          <div className={clsx(styles.techsWrapper)}>
            {techs.map((tech) => (
              <div key={tech.name} className={clsx(styles.techAvatar)}>
                {tech.githubProjectName && (
                  <a
                    href={`https://github.com/xframes-project/${tech.githubProjectName}`}
                    title={`Visit XFrames for ${tech.name} project's website`}
                  >
                    <img
                      src={tech.logoUrl}
                      alt={`${tech.name} logo`}
                      className={clsx("avatar__photo", styles.techAvatarImg)}
                    />
                  </a>
                )}
                {!tech.githubProjectName && (
                  <img
                    src={tech.logoUrl}
                    alt={`${tech.name} logo`}
                    className={clsx("avatar__photo", styles.techAvatarImg)}
                  />
                )}
                <div className="avatar__intro">
                  <small className="avatar__subtitle">
                    {tech.githubProjectName && (
                      <a
                        href={`https://github.com/xframes-project/${tech.githubProjectName}`}
                        title={`Visit XFrames for ${tech.name} project's website`}
                      >
                        {tech.name}
                      </a>
                    )}
                    {!tech.githubProjectName && tech.name}
                  </small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </Layout>
  );
}
