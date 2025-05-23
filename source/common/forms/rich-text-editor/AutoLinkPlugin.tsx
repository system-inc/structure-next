// Dependencies - Lexical
import { AutoLinkPlugin as AutoLink } from '@lexical/react/LexicalAutoLinkPlugin';

export function AutoLinkPlugin() {
    return (
        <AutoLink
            matchers={[
                // URL Matcher
                function (text: string) {
                    const urlMatcher =
                        /((https?:\/\/(www\.)?)|(www\.))[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

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
                // Email Matcher
                function (text: string) {
                    const emailMatcher =
                        /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;
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
            ]}
        />
    );
}
