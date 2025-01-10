import { getImageProps, ImageProps } from 'next/image';

type NextImageWithConditionalSourcesProps = {
    sources: {
        path: string;
        condition: string;
    }[];
} & Omit<ImageProps, 'src'>;
const NextImageWithConditionalSources = ({ sources, ...props }: NextImageWithConditionalSourcesProps) => {
    const baseProps = {
        ...props,
    };

    if(sources.length <= 1) throw new Error('NextImageWithConditionalSources requires at least two sources.');

    const { props: optimizedImgProps } = getImageProps({ ...baseProps, src: sources[0]!.path });

    // const optimizedSrcSets = sources.map((source) => {
    //     const { props } = getImageProps({ ...baseProps, src: source.path });

    //     // console.log({ srcSet: props.srcSet, path: source.path });
    //     return props;
    // });

    return (
        <picture>
            {sources.map((source) => {
                if(!source) return null;

                return <source key={source.path} media={source.condition} srcSet={source.path} />;
            })}
            <img {...optimizedImgProps} alt={optimizedImgProps.alt ?? ''} />
        </picture>
    );
};

export default NextImageWithConditionalSources;
