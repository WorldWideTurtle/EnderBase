type TimeBasedTextProps = {
    type: "year"
}

export function TimeBasedText(props : TimeBasedTextProps) {
    let finalText = "";
    switch (props.type) {
        case "year":
            finalText = (new Date()).getFullYear().toString()
            break;
    }

    return (
        <span>{finalText}</span>
    )
}