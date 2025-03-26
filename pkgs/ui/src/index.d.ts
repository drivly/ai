
export namespace components {
  export function Button(props: any): JSX.Element;
  export function ChatContainer(props: any): JSX.Element;
  export function ResizableHandle(props: any): JSX.Element;
  export function ResizablePanel(props: any): JSX.Element;
  export function ResizablePanelGroup(props: any): JSX.Element;
  export function ScrollButton(props: any): JSX.Element;
  export function Sheet(props: any): JSX.Element;
  export function SheetContent(props: any): JSX.Element;
  export function SheetDescription(props: any): JSX.Element;
  export function SheetTitle(props: any): JSX.Element;
}

export namespace hooks {
  export function useCheckMobile(): boolean;
  export function useOutsideClick(ref: any, callback: () => void): void;
}

export namespace lib {
  export function cn(...classes: any[]): string;
}
