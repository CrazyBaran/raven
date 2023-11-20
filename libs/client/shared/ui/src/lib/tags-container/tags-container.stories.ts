import { Story, Meta, moduleMetadata } from "@storybook/angular";
import { CeIconComponent } from "src/Enginuity-UI/Core/atoms/ce-icon/ce-icon.component";
import { TagsContainerComponent } from "./tags-container.component";

export default {
  title: "Products/Organisms/Create/Tags Container",
  component: TagsContainerComponent,
  decorators: [
    moduleMetadata({
      imports: [CeIconComponent],
    }),
  ],
} as Meta;

const Template: Story<TagsContainerComponent> = (
  args: TagsContainerComponent,
) => ({
  props: args,
});

export const With3Tags = Template.bind({});
With3Tags.args = {
  tags: ["tag1", "tag2", "tag3"],
};

export const WithLongNameTags = Template.bind({});
WithLongNameTags.args = {
  tags: [
    "lorem ipsum dolor sit amet",
    "consectetur adipis",
    "cing elit, sed",
    "do eiusmod tempor incididunt ut ",
    "labore et dolore magna aliqua",
    "tag2",
    "tag3",
  ],
};
