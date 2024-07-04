import { useWindowSize } from "usehooks-ts";

export function useIsMobile() {
    return useWindowSize().width < 640;
}
