import { Assembly } from "../core-main.js";
declare module "uc-control/src/core-main" {
    interface ResourceNamedRegistry {
    }
    interface TPPackage {
        "ap-shared-core": "";
    }
    interface AssemblyRegistry {
        "uc-control": Assembly;
    }
    interface ResourceKeyRegistry {
        "uc-control:097DF085-D799-43EC-A783-CBFA4F228820:00000000": "";
        "uc-control:097DF085-D799-43EC-A783-CBFA4F228820:00000001": "uc-control\\styles.scss";
        "uc-control:097DF085-D799-43EC-A783-CBFA4F228820:00000002": "";
        "uc-control:097DF085-D799-43EC-A783-CBFA4F228820:00000003": "uc-control\\src\\controls\\ucWinFrame.uc.html";
    }
}
