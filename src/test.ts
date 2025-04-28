import Yoga, { Direction, FlexDirection, type Node } from "yoga-layout";

function applyLayout(node: Node, level = "", idx = 0) {
    console.log(
		`${level}${idx} - ${node.hasNewLayout()} - ${node.getComputedTop()}+${node.getComputedLeft()}:${node.getComputedWidth()}x${node.getComputedHeight()}`,
	);

    if (!node.hasNewLayout()) return;
    node.markLayoutSeen();

	const childCount = node.getChildCount();
	for (let i = 0; i < childCount; i++) {
		const child = node.getChild(i);
        applyLayout(child, `${level}\t`, i);
	}
}

const root = Yoga.Node.create();
root.setWidth(800);
root.setHeight(400);
root.setFlexDirection(FlexDirection.Row);

const child0 = Yoga.Node.create();
child0.setHeight("100%");
child0.setFlex(1);

const child1 = Yoga.Node.create();
child1.setWidth(0);
child1.setHeight("100%");

const child2 = Yoga.Node.create();
child2.setWidth(400);
child2.setHeight("100%");
child2.setFlexDirection(FlexDirection.Column);

const child3 = Yoga.Node.create();
child3.setWidth("100%");

root.insertChild(child0, 0);
root.insertChild(child1, 1);
root.calculateLayout(undefined, undefined, Direction.LTR);

console.log("===================");
applyLayout(root);
console.log("===================");

child1.insertChild(child2, 0);
root.calculateLayout(undefined, undefined, Direction.LTR);
console.log("===================");
applyLayout(root);
console.log("===================");

child2.insertChild(child3, 0);
root.calculateLayout(undefined, undefined, Direction.LTR);
console.log("===================");
applyLayout(root);
console.log("===================");

child3.setHeight(10);
root.calculateLayout(undefined, undefined, Direction.LTR);
console.log("===================");
applyLayout(root);
console.log("===================");


child1.setWidth(400);
root.calculateLayout(undefined, undefined, Direction.LTR);
console.log("===================");
applyLayout(root);
console.log("===================");

child3.setHeight(20);
root.calculateLayout(undefined, undefined, Direction.LTR);
console.log("===================");
applyLayout(root);
console.log("===================");

child3.setWidth("100%");
child2.calculateLayout(undefined, undefined, Direction.LTR);
console.log(child3.getComputedWidth());

child3.setWidth(10);
child2.calculateLayout(undefined, undefined, Direction.LTR);
console.log(child3.getComputedWidth());
