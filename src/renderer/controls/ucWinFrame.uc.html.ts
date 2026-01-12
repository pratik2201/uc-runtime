import { HTMLx, IHTMLxSource } from "../../lib/WrapperHelper.js";
const ucWinFrame$Dynamic = HTMLx.Design({
    dynamicFilePath: import.meta.url,
    htmlSource() {
        const ls = HTMLx.Wrapper({ "x-caption": 'Frame'  },
            HTMLx.Tag('main-container',{},
                HTMLx.Tag('title-bar', { "x-name": 'titlebar1' },
                    HTMLx.Tag('title-text', { "x-name": 'lbl_title' },
                        "TITLE "
                    ),
                    HTMLx.Tag('icon-button', { "x-name": 'cmd_close' },
                        "╳"
                    )
                ),
                HTMLx.Tag('container', { "x-name": 'container1' },

                )
            )
        );
        return ls;
    },
}); 
export default ucWinFrame$Dynamic;