import { Content, List, Root, Trigger } from "@radix-ui/react-tabs";

export default function page() {
    return (
        <Root defaultValue="members">
            <List aria-label="Switch display" className="pb-6 flex">
                <Trigger value="members" className="relative flex-1 p-2 text-lg after:transition-[background-color] aria-selected:after:bg-purple-400 after:bg-input after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 aria-selected:after:h-1">
                    Members
                </Trigger>
                <Trigger value="world" className="relative flex-1 p-2 text-lg after:transition-[background-color] aria-selected:after:bg-purple-400 after:bg-input after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 aria-selected:after:h-1">
                    World
                </Trigger>
            </List>
            <Content value="members">
                <h3>Generate new invite link</h3>
                <h3>Manage your members</h3>
            </Content>
            <Content value="world">
                <h3>Change name</h3>
                <h3>Danger</h3>
                <h3>Delete project</h3>
            </Content>
        </Root>
    )
}