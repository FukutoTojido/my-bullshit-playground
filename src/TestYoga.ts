import Yoga, { Direction, Edge, FlexDirection } from "yoga-layout";

const root = Yoga.Node.create();
root.setWidth(100);
root.setHeight(100);
root.setFlexDirection(FlexDirection.Row);

const child0 = Yoga.Node.create();
child0.setWidth(100);
child0.setHeight(50);
child0.setMargin(Edge.Right, 10);
root.insertChild(child0, 0);

const child1 = Yoga.Node.create();
child1.setWidth(100);
child1.setHeight(50);
root.insertChild(child1, 1);

root.calculateLayout(undefined, undefined, Direction.LTR);

console.log(
	root.getComputedTop(),
	root.getComputedRight(),
	root.getComputedBottom(),
	root.getComputedLeft(),
	root.getComputedWidth(),
	root.getComputedHeight(),
);
console.log(child0.getComputedLeft());
console.log(child1.getComputedLeft());
