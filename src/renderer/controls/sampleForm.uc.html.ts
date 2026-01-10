import { HTMLx, IHTMLxSource } from "../../lib/WrapperHelper.js";
import ucWinFrame$Dynamic from "./ucWinFrame.uc.html.js";
export default {
    dynamicFilePath: import.meta.url,
    htmlSource() {
        const ls = HTMLx.Wrapper({ "x-caption": 'Sample Form', },
            HTMLx.Usercontrol('winframe1', ucWinFrame$Dynamic, import.meta.url, {},
                HTMLx.Tag('formcontainer', {},
                    HTMLx.Tag('h1', {},
                        "HELLO THERE"
                    )
                )
            )
        );
        return ls;
    },
} as IHTMLxSource;