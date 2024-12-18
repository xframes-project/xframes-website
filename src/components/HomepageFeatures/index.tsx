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
    title: 'Based on Dear ImGui',
    Svg: require('@site/static/img/dear-imgui.svg').default,
    description: (
      <>
        <a href="https://github.com/ocornut/imgui" target="_blank">Dear ImGui</a>, trusted by <a href="https://github.com/ocornut/imgui/wiki/Software-using-dear-imgui#games" target="_blank">countless AAA game developers</a> (<a href="https://montreal.ubisoft.com/en/ubisoft-sponsors-user-interface-library-for-c-dear-imgui/" target="_blank">including Ubisoft</a>), enhances XFrames with ultra-responsive, lightweight UIs built for speed. Its immediate-mode rendering delivers smooth, high-performance interfaces without the bulk, perfect for XFrames' GPU-accelerated, cross-platform needs.
      </>
    ),
  },
  {
    title: 'GPU-Accelerated',
    Svg: require('@site/static/img/webgpu-opengl.svg').default,
    description: (
      <>
        Unlock the full potential of XFrames for building fast, GPU-accelerated interfaces.
        Leverage <a href="https://en.wikipedia.org/wiki/WebGPU" target="_blank">WebGPU</a> for stunning browser performance or use <a href="https://www.glfw.org" target="_blank">GLFW3</a> and <a href="https://www.opengl.org" target="_blank">OpenGL</a> in Node.js to create native-like applications—without the need for Electron.
      </>
    ),
  },
  {
    title: 'No CSS Required',
    Svg: require('@site/static/img/yoga-layouts.svg').default,
    description: (
      <>
        XFrames empowers you to create high-performance UIs based on the flexibility and scalability of <a href="https://www.yogalayout.dev" target="_blank">Yoga Layout</a>, without the complexity of the DOM or CSS. Focus on building sleek, efficient applications with a clean and simple development experience.
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
