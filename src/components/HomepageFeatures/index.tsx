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
        Dear ImGui, trusted by AAA game developers, enhances xframes with ultra-responsive, lightweight UIs built for speed. Its immediate-mode rendering delivers smooth, high-performance interfaces without the bulk, perfect for xframes' GPU-accelerated, cross-platform needs.
      </>
    ),
  },
  {
    title: 'GPU-Accelerated',
    Svg: require('@site/static/img/webgpu-opengl.svg').default,
    description: (
      <>
        Unlock the full potential of xframes for building fast, GPU-accelerated interfaces. Leverage WebGPU for stunning browser performance or use GLFW3 and OpenGL in Node.js to create native-like applications—without the need for Electron.
      </>
    ),
  },
  {
    title: 'No CSS Required',
    Svg: require('@site/static/img/g1.svg').default,
    description: (
      <>
        xframes empowers you to create high-performance UIs using React and Yoga Layouts, without the complexity of the DOM or CSS. Focus on building sleek, efficient applications with a clean and simple development experience.
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

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
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
