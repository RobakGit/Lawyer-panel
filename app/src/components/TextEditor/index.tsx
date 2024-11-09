import { ContentState, Editor, EditorState, convertToRaw } from "draft-js";
// import "draft-js/dist/Draft.css";
import styles from "@/styles/TextEditor.module.css";
import { Component, createRef, CSSProperties } from "react";
import ToolsContainer from "./ToolsContainer";
import { stateToHTML } from "draft-js-export-html";
import { stateFromHTML } from "draft-js-import-html";

type Props = {
  content: string;
  save: (content: string) => void;
  style?: CSSProperties;
};

type State = { editorState: EditorState };

export default class TextEditor extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.stateToHtmlWithStyles = this.stateToHtmlWithStyles.bind(this);
    this.HtmlWithStylesToState = this.HtmlWithStylesToState.bind(this);
    this.state = {
      editorState: EditorState.createWithContent(
        this.HtmlWithStylesToState(props.content)
      ),
    };
  }

  componentDidMount() {
    this.editorRef.current?.focus();
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  HtmlWithStylesToState = (html: string): ContentState => {
    const options = {
      elementStyles: {
        b: "BOLD",
        i: "ITALIC",
        s: "STRIKETHROUGH",
        u: "UNDERLINE",
        mark: "HIGHLIGHT",
      },
    };
    return stateFromHTML(html, options);
  };

  stateToHtmlWithStyles = (editorContent: ContentState) => {
    const options = {
      inlineStyles: {
        BOLD: { element: "b" },
        ITALIC: { element: "i" },
        STRIKETHROUGH: { element: "s" },
        UNDERLINE: { element: "u" },
        HIGHLIGHT: { element: "mark" },
      },
    };
    return stateToHTML(editorContent, options);
  };

  handleClickOutside(event: MouseEvent) {
    if (
      this.editorContainerRef &&
      !this.editorContainerRef?.current?.contains(event.target as Node)
    ) {
      const content = this.stateToHtmlWithStyles(
        this.state.editorState.getCurrentContent()
      );
      this.props.save(content);
    }
  }

  editorContainerRef = createRef<HTMLDivElement>();
  editorRef = createRef<Editor>();

  onChange = (editorState: EditorState) => {
    this.setState({ editorState });
  };

  render() {
    return (
      <div
        className={styles.editorContainer}
        ref={this.editorContainerRef}
        style={this.props.style}
      >
        <ToolsContainer
          editorState={this.state.editorState}
          onChange={this.onChange}
        />
        <Editor
          ref={this.editorRef}
          editorState={this.state.editorState}
          onChange={this.onChange}
        />
      </div>
    );
  }
}
