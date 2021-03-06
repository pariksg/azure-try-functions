
export class Dom {
    public static setFocusable(element: HTMLElement) {
        element.tabIndex = 0;
    }

    public static setFocus(element: HTMLElement) {
        element.tabIndex = 0;
        element.focus();
    }

    public static clearFocus(element: HTMLElement) {
        element.tabIndex = -1;
    }

    // This isn't comprehensive but is good enough for our current scenarios.  To get more context, checkout these links:
    // https://stackoverflow.com/questions/7208161/focus-next-element-in-tab-index
    // https://stackoverflow.com/questions/7668525/is-there-a-jquery-selector-to-get-all-elements-that-can-get-focus
    public static getTabbableControls(element: HTMLElement): NodeList {
        return element.querySelectorAll('input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), object:not([disabled]), a:not([disabled]), area:not([disabled]), .link, div.sortable, [tabindex="0"]');
    }

    public static getTabbableControl(element: HTMLElement, excludedClassList?: string[]): HTMLElement {
        const controls = this.getTabbableControls(element);

        if (controls.length !== 0) {
            if (!excludedClassList || excludedClassList.length === 0) {
                return <HTMLElement>controls[0];
            } else {
                for (let i = 0; i < controls.length; i++) {
                    const controlElement = <HTMLElement>controls[i];
                    let excluded = false;
                    for (let j = 0; j < excludedClassList.length; j++) {
                        if (controlElement.classList.contains(excludedClassList[j])) {
                            excluded = true;
                            break;
                        }
                    }
                    if (!excluded) {
                        return controlElement;
                    }
                }
            }
        }

        return element;
    }

    //https://stackoverflow.com/questions/5598743/finding-elements-position-relative-to-the-document
    public static getElementCoordinates(elem: HTMLElement) {
        const box = elem.getBoundingClientRect();

        const body = document.body;
        const docEl = document.documentElement;

        const scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
        const scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

        const clientTop = docEl.clientTop || body.clientTop || 0;
        const clientLeft = docEl.clientLeft || body.clientLeft || 0;

        const top = box.top + scrollTop - clientTop;
        const left = box.left + scrollLeft - clientLeft;

        return { top: Math.round(top), left: Math.round(left) };
    }

    public static scrollIntoView(elem: HTMLElement, container: HTMLElement) {
        const viewBottom = container.scrollTop + container.clientHeight;
        let elemCoordinates: { top: number };

        if (container.tagName === 'BODY') {
            elemCoordinates = Dom.getElementCoordinates(elem);
        } else {
            elemCoordinates = {
                top: elem.offsetTop
            };
        }

        if (elemCoordinates.top + elem.clientHeight + 2 > viewBottom) {
            // If view is scrolled way out of view, then scroll so that selected is top
            if (viewBottom + elem.clientHeight < elem.offsetTop) {
                container.scrollTop = elem.offsetTop;
            } else {
                container.scrollTop += elem.clientHeight + 1;  // +1 for margin
            }
        } else if (elemCoordinates.top - 1 <= container.scrollTop) {
            // If view needs to scroll up
            if (container.scrollTop - elem.clientHeight > elem.offsetTop) {
                container.scrollTop = elemCoordinates.top;
            } else {
                container.scrollTop -= elem.clientHeight;
            }
        }

    }
}