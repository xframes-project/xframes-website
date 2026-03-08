import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'React Components',
    Svg: require('@site/static/img/dear-imgui.svg').default,
    description: (
      <>
        Write standard React components with hooks, state, and refs. XFrames renders them as native{' '}
        <a href="https://github.com/ocornut/imgui" target="_blank">Dear ImGui</a> widgets via a custom React Fabric renderer — no DOM, no browser engine.
      </>
    ),
  },
  {
    title: 'GPU-Accelerated Rendering',
    Svg: require('@site/static/img/webgpu-opengl.svg').default,
    description: (
      <>
        <a href="https://www.glfw.org" target="_blank">GLFW</a> +{' '}
        <a href="https://www.opengl.org" target="_blank">OpenGL</a> on desktop,{' '}
        <a href="https://en.wikipedia.org/wiki/WebGPU" target="_blank">WebGPU</a> in the browser.
        Render data-heavy UIs at native speed with no Electron overhead.
      </>
    ),
  },
  {
    title: 'Yoga Flexbox Layout',
    Svg: require('@site/static/img/yoga-layouts.svg').default,
    description: (
      <>
        Use familiar flexbox properties — <code>flexDirection</code>, <code>padding</code>,{' '}
        <code>gap</code>, percentage widths — powered by{' '}
        <a href="https://www.yogalayout.dev" target="_blank">Yoga Layout</a>. No CSS files, no class names.
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures({className}): JSX.Element {
  return (
    <section className={clsx(styles.features, className)}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
