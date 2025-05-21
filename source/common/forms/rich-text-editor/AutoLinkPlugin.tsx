import { AutoLinkPlugin as AutoLink } from '@lexical/react/LexicalAutoLinkPlugin';

const urlMatcher =
    /((https?:\/\/(www\.)?)|(www\.))[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

const emailMatcher =
    /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;

const matchers = [
    function (text: string) {
        const match = urlMatcher.exec(text);
        return (
            match && {
                index: match.index,
                length: match[0].length,
                text: match[0],
                url: match[0],
            }
        );
    },
    function (text: string) {
        const match = emailMatcher.exec(text);
        return (
            match && {
                index: match.index,
                length: match[0].length,
                text: match[0],
                url: `mailto:${match[0]}`,
            }
        );
    },
];

export function AutoLinkPlugin() {
    return <AutoLink matchers={matchers} />;
}
