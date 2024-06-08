import styles from "@/styles/TextEditor.module.css";
import { Component } from "react";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatStrikethroughIcon from "@mui/icons-material/FormatStrikethrough";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import HighlightIcon from "@mui/icons-material/Highlight";
import FunctionButton from "./FunctionButton";
import { EditorState, RichUtils } from "draft-js";

type Props = {
  editorState: EditorState;
  onChange: (editorState: EditorState) => void;
};

function Separator() {
  return <div className={styles.separator}></div>;
}

export default class ToolsContainer extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  boldClick = () => {
    this.props.onChange(
      RichUtils.toggleInlineStyle(this.props.editorState, "BOLD")
    );
  };
  italicClick = () => {
    this.props.onChange(
      RichUtils.toggleInlineStyle(this.props.editorState, "ITALIC")
    );
  };
  strikethroughClick = () => {
    this.props.onChange(
      RichUtils.toggleInlineStyle(this.props.editorState, "STRIKETHROUGH")
    );
  };
  underlineClick = () => {
    this.props.onChange(
      RichUtils.toggleInlineStyle(this.props.editorState, "UNDERLINE")
    );
  };
  highlightClick = () => {
    this.props.onChange(
      RichUtils.toggleInlineStyle(this.props.editorState, "HIGHLIGHT")
    );
  };
  bulletListClick = () => {
    this.props.onChange(
      RichUtils.toggleBlockType(this.props.editorState, "unordered-list-item")
    );
  };
  numberedListClick = () => {
    this.props.onChange(
      RichUtils.toggleBlockType(this.props.editorState, "ordered-list-item")
    );
  };

  render() {
    return (
      <div className={styles.toolsContainer}>
        <FunctionButton onClick={this.boldClick} icon={<FormatBoldIcon />} />
        <FunctionButton
          onClick={this.italicClick}
          icon={<FormatItalicIcon />}
        />
        <FunctionButton
          onClick={this.strikethroughClick}
          icon={<FormatStrikethroughIcon />}
        />
        <FunctionButton
          onClick={this.underlineClick}
          icon={<FormatUnderlinedIcon />}
        />
        <FunctionButton
          onClick={this.highlightClick}
          icon={<HighlightIcon />}
        />
        <Separator />
        <FunctionButton
          onClick={this.bulletListClick}
          icon={<FormatListBulletedIcon />}
        />
        <FunctionButton
          onClick={this.numberedListClick}
          icon={<FormatListNumberedIcon />}
        />
      </div>
    );
  }
}
