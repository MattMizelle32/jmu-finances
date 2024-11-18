import * as d3 from 'd3';
import * as d3Sankey from 'd3-sankey';

const width = 928;
const height = 600;
const format = d3.format(",.0f");
const linkColor = "source-target"; // source, target, source-target, or a color string.

// Create a SVG container.
const svg = d3.create("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("viewBox", [0, 0, width, height])
  .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

// Constructs and configures a Sankey generator.
const sankey = d3Sankey.sankey()
  .nodeId(d => d.name)
  .nodeAlign(d3Sankey.sankeyJustify) // d3.sankeyLeft, etc.
  .nodeWidth(15)
  .nodePadding(10)
  .extent([[1, 5], [width - 1, height - 5]]);

function forDiagram1(jmuData) {
  const relevantData = jmuData["student-costs"]
  const nodes = getNodes1(relevantData);
  const links = getLinks1(relevantData);
  return { nodes, links };
}

function getNodes1(jmuData) {
  const nodes = [
    ...getJMUStudentNodes(jmuData),
    ...getSemesterNodes(jmuData),
    ...getStudentItemized(jmuData)
  ]
  return nodes;
}

function getLinks1(jmuData) {
  const links = [
    ...StudentSemesterLinks(jmuData),
    ...SemesterItemizedLinks(jmuData)
  ]
  return links;
}

function getJMUStudentNodes(jmuData) {
  // THis will be an array with a single node "JMU Student"
  const JMUStudent = [];
  const jmuStudentNode = {
    name: "JMU Student",
    title: "JMU Student"
  };
  JMUStudent.push(jmuStudentNode);
  console.log('JMUStudentNode', JMUStudent);
  return JMUStudent;
}

function getSemesterNodes(jmuData) {
  // filter jmuData for objects with the attribute "semester" in the object
  const semesters = jmuData.filter(item => item.hasOwnProperty("semester"));
  const semesterNodes = [];
  const semesterSet = new Set();

  for (let i = 0; i < semesters.length; i++) {
    if (!semesterSet.has(semesters[i]["semester"])) {
      let node = {
        name: semesters[i]["semester"],
        title: semesters[i]["semester"]
      };
      semesterNodes.push(node);
      semesterSet.add(semesters[i]["semester"]);
    }
  }

  console.log('semesterNodes', semesterNodes);
  return semesterNodes;
}

function StudentSemesterLinks(jmuData) {
  const semesters = jmuData.filter(item => item.hasOwnProperty("semester"));
  const studentSemesterLinks = [];
  const semesterSet = new Set();

  for (let i = 0; i < semesters.length; i++) {
    if (!semesterSet.has(semesters[i]["name"])) {
      let link = {
        source: "JMU Student",
        target: semesters[i]["semester"]
      };
      if (semesters[i].hasOwnProperty("in-state")) {
        link.value = semesters[i]["in-state"];
      } else {
        link.value = semesters[i]["amount"];
      }
      studentSemesterLinks.push(link);
      semesterSet.add(semesters[i]["name"]);
    }
  }

  console.log('studentSemesterLinks', studentSemesterLinks);
  return studentSemesterLinks;
}

function getStudentItemized(jmuData) {
  const semesters = jmuData.filter(item => item.hasOwnProperty("semester"));
  const itemizedNodes = [];
  const itemizedSet = new Set();

  for (let i = 0; i < semesters.length; i++) {
    if (!itemizedSet.has(semesters[i]["name"])) {
      let node = {
        name: semesters[i]["name"],
        title: semesters[i]["name"]
      };
      itemizedNodes.push(node);
      itemizedSet.add(semesters[i]["name"]);
    }
  }

  console.log('itemizedNodes', itemizedNodes);
  return itemizedNodes;
}

function SemesterItemizedLinks(jmuData) {
  const semesters = jmuData.filter(item => item.hasOwnProperty("semester"));
  const itemizedLinks = [];
  const itemizedSet = new Set();

  for (let i = 0; i < semesters.length; i++) {
    if (!itemizedSet.has(semesters[i]["name"])) {
      let link = {
        source: semesters[i]["semester"],
        target: semesters[i]["name"]
      };
      if (semesters[i].hasOwnProperty("in-state")) {
        link.value = semesters[i]["in-state"];
      } else {
        link.value = semesters[i]["amount"];
      }
      itemizedLinks.push(link);
      itemizedSet.add(semesters[i]["name"]);
    }
  }

  console.log('itemizedLinks', itemizedLinks);
  return itemizedLinks;
}

function forDiagram2(jmuData) {
  const relevantData = jmuData["student-costs"];
  const nodes = getNodes2(relevantData);
  const links = getLinks2(relevantData);
  return { nodes, links };
}

function getNodes2(jmuData) {
  const nodes = [
    ...getComprehensiveFeeNode(jmuData),
    ...getAuxiliaryComponentFee(jmuData)
  ];
  return nodes;
}

function getLinks2(jmuData) {
  const links = [
    ...getComprehensiveFeeLinks(jmuData),
  ]
  return links;
}

function getComprehensiveFeeNode(jmuData) {
  const comprehensiveFee = [];
  const comprehensiveFeeNode = {
    name: "Comprehensive Fee",
    title: "Comprehensive Fee"
  };
  comprehensiveFee.push(comprehensiveFeeNode);

  console.log('comprehensiveFee', comprehensiveFee);
  return comprehensiveFee;
}

function getAuxiliaryComponentFee(jmuData) {
  // from the jmuData, filter for objects with the attribute "type" in the object and filter for auxiliary
  const auxComponents = jmuData.filter(item => item.hasOwnProperty("subtype"));
  const auxComponentNodes = [];
  const auxComponentSet = new Set();

  for (let i = 0; i < auxComponents.length; i++) {
    if (!auxComponentSet.has(auxComponents[i]["subtype"])) {
      let node = {
        name: auxComponents[i]["subtype"],
        title: auxComponents[i]["subtype"]
      };
      auxComponentNodes.push(node);
      auxComponentSet.add(auxComponents[i]["subtype"]);
    }
  }

  console.log('auxComponentNodes', auxComponentNodes);
  return auxComponentNodes;
}

function getComprehensiveFeeLinks(jmuData) {
  // link the comprehensive fee to the auxiliary components
  const auxComponents = jmuData.filter(item => item.hasOwnProperty("subtype"));
  const comprehensiveFeeLinks = [];
  const auxComponentSet = new Set();

  for (let i = 0; i < auxComponents.length; i++) {
    if (!auxComponentSet.has(auxComponents[i]["subtype"])) {
      let link = {
        source: "Comprehensive Fee",
        target: auxComponents[i]["subtype"]
      };
      link.value = auxComponents[i]["amount"];
      comprehensiveFeeLinks.push(link);
      auxComponentSet.add(auxComponents[i]["subtype"]);
    }
  }

  console.log('comprehensiveFeeLinks', comprehensiveFeeLinks);
  return comprehensiveFeeLinks;
}

function forDiagram3(jmuData) {
  const relevantData = jmuData["jmu-revenues"]
  const nodes = getNodes3(relevantData);
  const links = getLinks3(relevantData);
  return { nodes, links };
}

function getNodes3(jmuData) {
  const nodes = [
    //add functions to get nodes for each needed
    ...getRevenueItems(jmuData), //LEFTMOST
    ...getRevenueNodes(jmuData), //2nd to left
    ...getJMUNodes(jmuData), //MIDDLE
    ...getJMUExpense(jmuData), //2nd to right
    ...getJMUExpenseItem(jmuData) //RIGHTMOST
  ];
  return nodes;
}

function getLinks3(jmuData) {
  const links = [
    //add functions to get links for each needed
    ...getRevenueLinks(jmuData),
    ...getRevJMULink(jmuData),
    ...getJMUExpenseLink(jmuData),
    ...getExpenseLinks(jmuData)
  ];
  return links;
}

function getRevenueItems(jmuData) {
  console.log('jmuData', jmuData);
  const positiveRevenue = jmuData.filter(item => item["category"] === "income");
  const revenueNodes = [];

  for (let i = 0; i < positiveRevenue.length; i++) {
    let node = {
      name: positiveRevenue[i]["name"],
      title: positiveRevenue[i]["name"]
    }
    revenueNodes.push(node);
  }
  console.log('RevenueItemNodes', revenueNodes);
  return revenueNodes;
}

function getRevenueNodes(jmuData) {
  const positiveRevenue = jmuData.filter(item => item["category"] === "income");
  const revenueNodes = [];
  const typesSet = new Set();

  for (let i = 0; i < positiveRevenue.length; i++) {
    if (!typesSet.has(positiveRevenue[i]["type"])) {
      let node = {
        name: positiveRevenue[i]["type"],
        title: positiveRevenue[i]["type"]
      };
      revenueNodes.push(node);
      typesSet.add(positiveRevenue[i]["type"]);
    }
  }

  function getRevenueLinks(jmuData) {

  }

  console.log('revenueNodes', revenueNodes);
  return revenueNodes;
}

function getRevenueLinks(jmuData) {
  const positiveRevenue = jmuData.filter(item => item["category"] === "income");
  const revenueLinks = [];
  const typesSet = new Set();

  for (let i = 0; i < positiveRevenue.length; i++) {
    if (!typesSet.has(positiveRevenue[i]["name"])) {
      let link = {
        source: positiveRevenue[i]["name"],
        target: positiveRevenue[i]["type"],
        value: positiveRevenue[i]["2023"]
      };
      revenueLinks.push(link);
      typesSet.add(positiveRevenue[i]["name"]);
    }
  }

  console.log('revenueLinks', revenueLinks);
  return revenueLinks;
}

function getJMUNodes(jmuData) {
  // this should just be one node "JMU"
  const JMU = [];
  const jmuNode = {
    name: "JMU",
    title: "JMU"
  };
  JMU.push(jmuNode);
  return JMU;
}

function getRevJMULink(jmuData) {
  const positiveRevenue = jmuData.filter(item => item["category"] === "income");
  const revJMULink = [];
  const typesSet = new Set();

  for (let i = 0; i < positiveRevenue.length; i++) {
    if (!typesSet.has(positiveRevenue[i]["type"])) {
      let link = {
        source: positiveRevenue[i]["type"],
        target: "JMU",
        value: positiveRevenue[i]["2023"]
      };
      revJMULink.push(link);
      typesSet.add(positiveRevenue[i]["type"]);
    }
  }

  console.log('revJMULink', revJMULink);
  return revJMULink;
}

function getJMUExpense(jmuData) {
  const negativeRevenue = jmuData.filter(item => item["category"] === "expense");
  const expenseNodes = [];
  const typesSet = new Set();
  let idCounter = 1;
  for (let i = 0; i < negativeRevenue.length; i++) {
    if (!typesSet.has(negativeRevenue[i]["type"])) {
      let node = {
        name: idCounter,
        title: negativeRevenue[i]["type"]
      };
      expenseNodes.push(node);
      typesSet.add(negativeRevenue[i]["type"]);
      idCounter++;
    }
  }

  console.log('expenseNodes', expenseNodes);
  return expenseNodes;
}

function getJMUExpenseItem(jmuData) {
  const negativeRevenue = jmuData.filter(item => item["category"] === "expense");
  const expenseItemNodes = [];
  const itemsSet = new Set();

  for (let i = 0; i < negativeRevenue.length; i++) {
    if (!itemsSet.has(negativeRevenue[i]["name"])) {
      let node = {
        name: negativeRevenue[i]["name"],
        title: negativeRevenue[i]["name"]
      };
      expenseItemNodes.push(node);
      itemsSet.add(negativeRevenue[i]["name"]);
    }
  }

  console.log('expenseItemNodes', expenseItemNodes);
  return expenseItemNodes;
}

function getJMUExpenseLink(jmuData) {
  const expenseData = jmuData.filter(item => item["category"] === "expense");
  const JMUExpenseLink = [];
  const typesSet = new Set();
  let counter = 1;

  for (let i = 0; i < expenseData.length; i++) {
    if (!typesSet.has(expenseData[i]["type"])) {
      let link = {
        source: "JMU",
        target: counter,
        value: expenseData[i]["2023"]
      };
      JMUExpenseLink.push(link);
      typesSet.add(expenseData[i]["type"]);
      counter++;
    }
  }

  console.log('JMUeExpenseLink', JMUExpenseLink);
  return JMUExpenseLink;
}

function getExpenseLinks(jmuData) {

  const expenseData = jmuData.filter(item => item["category"] === "expense");
  const expenseLinks = [];
  const typesMap = new Map();
  let categoryCounter = 1;

  for (let i = 0; i < expenseData.length; i++) {
    const type = expenseData[i]["type"];
    if (!typesMap.has(type)) {
      typesMap.set(type, categoryCounter);
      categoryCounter++;
    }
    let link = {
      source: typesMap.get(type),
      target: expenseData[i]["name"],
      value: expenseData[i]["2023"]
    };
    expenseLinks.push(link);
  }

  console.log('expenseLinks', expenseLinks);
  return expenseLinks;
}

function forDiagram4(jmuData) {
  const relevantData = jmuData["jmu-athletics"];
  const nodes = getNodes4(relevantData);
  const links = getLinks4(relevantData);
  return { nodes, links };
}

function getNodes4(jmuData) {
  const nodes = [
    ...getSportCategoryNodes(jmuData),
    ...positiveRevenueNodes(jmuData),
    ...getJMUAtheleticsNode(jmuData),
    ...getExpenseNodes(jmuData),
    ...getSportCategory2ndNodes(jmuData)
  ];
  return nodes;
}

function getLinks4(jmuData) {
  const links = [
    ...getSportRevenueLinks(jmuData),
    ...getRevenueTOJMUlink(jmuData),
    ...getJMUExpensesLinks(jmuData),
    ...getExpensesLinks(jmuData)
  ];
  return links;
}

function getSportCategoryNodes(jmuData) {
  //create nodes for Football, Men's Basketball, Women's Basketball, Other Sports, and Non-Program Specific"
  const sportCategories = ["Football", "Men's Basketball", "Women's Basketball", "Other sports", "Non-Program Specific"];
  const sportCategoryNodes = [];
  for (let i = 0; i < sportCategories.length; i++) {
    let node = {
      name: sportCategories[i],
      title: sportCategories[i]
    };
    sportCategoryNodes.push(node);
  }
  console.log('sportCategoryNodes', sportCategoryNodes);
  return sportCategoryNodes;
}

function positiveRevenueNodes(jmuData) {
//where the object type is "operating revenue", use the "name"
  const positiveRevenue = jmuData.filter(item => item["type"] === "Operating Revenues");
  const revenueNodes = [];
  for (let i = 0; i < positiveRevenue.length; i++) {
    let node = {
      name: positiveRevenue[i]["name"],
      title: positiveRevenue[i]["name"]
    };
    revenueNodes.push(node);
  }
  console.log('revenueNodes', revenueNodes);
  return revenueNodes;
}

function getSportRevenueLinks(jmuData) {
  const positiveRevenue = jmuData.filter(item => item["type"] === "Operating Revenues");
  const sportRevenueLinks = [];
  for (let i = 0; i < positiveRevenue.length; i++) {
    if (positiveRevenue[i]["Football"] > 0) {
      let link = {
        source: "Football",
        target: positiveRevenue[i]["name"],
        value: positiveRevenue[i]["Football"]
      };
      sportRevenueLinks.push(link);
    }

    if (positiveRevenue[i]["Men's Basketball"] > 0) {
      let link = {
        source: "Men's Basketball",
        target: positiveRevenue[i]["name"],
        value: positiveRevenue[i]["Men's Basketball"]
      };
      sportRevenueLinks.push(link);
    }

    if (positiveRevenue[i]["Women's Basketball"] > 0) {
      let link = {
        source: "Women's Basketball",
        target: positiveRevenue[i]["name"],
        value: positiveRevenue[i]["Women's Basketball"]
      };
      sportRevenueLinks.push(link);
    }

    if (positiveRevenue[i]["Other Sports"] > 0) {
      let link = {
        source: "Other Sports",
        target: positiveRevenue[i]["name"],
        value: positiveRevenue[i]["other Sports"]
      };
      sportRevenueLinks.push(link);
    }

    if (positiveRevenue[i]["Non-Program Specific"] > 0) {
      let link = {
        source: "Non-Program Specific",
        target: positiveRevenue[i]["name"],
        value: positiveRevenue[i]["Non-Program Specific"]
      };
      sportRevenueLinks.push(link);
    }

  }
  console.log('sportRevenueLinks', sportRevenueLinks);
  return sportRevenueLinks;
}

function getJMUAtheleticsNode(jmuData) {
  const JMU = [];
  const jmuNode = {
    name: "JMU Athletics",
    title: "JMU Athletics"
  };
  JMU.push(jmuNode);
  console.log('JMU', JMU);
  return JMU;
}

function getRevenueTOJMUlink(jmuData) {
  const positiveRevenue = jmuData.filter(item => item["type"] === "Operating Revenues");
  const revenueToJMU = [];
  for (let i = 0; i < positiveRevenue.length; i++) {
    let link = {
      source: positiveRevenue[i]["name"],
      target: "JMU Athletics",
      value: positiveRevenue[i]["Total"]
    };
    revenueToJMU.push(link);
  }
  console.log('revenueToJMU', revenueToJMU);
  return revenueToJMU;
}

function getExpenseNodes(jmuData) {
  const negativeRevenue = jmuData.filter(item => item["type"] === "Operating Expenses");
  const expenseNodes = [];
  let counter = 1;
  for (let i = 0; i < negativeRevenue.length; i++) {
    let node = {
      name: counter,
      title: negativeRevenue[i]["name"]
    };
    expenseNodes.push(node);
    counter++;
  }
  console.log('expenseNodes', expenseNodes);
  return expenseNodes;
}

function getJMUExpensesLinks(jmuData) {
  // link the JMU Athletics to the expenses
  const negativeRevenue = jmuData.filter(item => item["type"] === "Operating Expenses");
  const JMUExpenseLinks = [];
  const typesSet = new Set();
  let counter = 1;
  for (let i = 0; i < negativeRevenue.length; i++) {
    if (!typesSet.has(negativeRevenue[i]["name"])) {
      let link = {
        source: "JMU Athletics",
        target: counter,
        value: negativeRevenue[i]["Total"]
      };
      JMUExpenseLinks.push(link);
      typesSet.add(negativeRevenue[i]["name"]);
      counter++;
    }
  }
  console.log('JMUExpenseLinks', JMUExpenseLinks);
  return JMUExpenseLinks;
}

function getSportCategory2ndNodes(jmuData) {
    //create nodes for Football, Men's Basketball, Women's Basketball, Other Sports, and Non-Program Specific"
    const sportCategories = ["Football", "Men's Basketball", "Women's Basketball", "Other sports", "Non-Program Specific"];
    const sportCategoryNodes = [];
    for (let i = 0; i < sportCategories.length; i++) {
      let node = {
        name: i+100,
        title: sportCategories[i]
      };
      sportCategoryNodes.push(node);
    }
    console.log('sportCategory2ndNodes', sportCategoryNodes);
    return sportCategoryNodes;
}

function getExpensesLinks(jmuData) {
  const negativeRevenue = jmuData.filter(item => item["type"] === "Operating Expenses");
  const JMUExpenseLinks = [];
  const typesSet = new Set();
  let counter = 1;
  for (let i = 0; i < negativeRevenue.length; i++) {

    if (!typesSet.has(negativeRevenue[i]["name"])) {
      if (negativeRevenue[i]["Football"] > 0) {
        let link1 = {
          source: counter,
          target: 100,
          value: negativeRevenue[i]["Football"]
        };
        JMUExpenseLinks.push(link1);
      }

      if(negativeRevenue[i]["Men's Basketball"] > 0) {
        let link2 = {
          source: counter,
          target: 101,
          value: negativeRevenue[i]["Men's Basketball"]
        };
        JMUExpenseLinks.push(link2);
      }

      if(negativeRevenue[i]["Women's Basketball"] > 0) {
        let link3 = {
          source: counter,
          target: 102,
          value: negativeRevenue[i]["Women's Basketball"]
        };
        JMUExpenseLinks.push(link3);
      }

      if(negativeRevenue[i]["Other sports"] > 0) {
        let link4 = {
          source: counter,
          target: 103,
          value: negativeRevenue[i]["Other sports"]
        };
        JMUExpenseLinks.push(link4);
      }

      if(negativeRevenue[i]["Non-Program Specific"] > 0) {
        let link5 = {
          source: counter,
          target: 104,
          value: negativeRevenue[i]["Non-Program Specific"]
        };
        JMUExpenseLinks.push(link5);
        }

      typesSet.add(negativeRevenue[i]["name"]);
      counter++;
    }
  }
  console.log('JMUExpenseLinks', JMUExpenseLinks);
  return JMUExpenseLinks;
}

async function init() {
  //const data = await d3.json("data/data_sankey.json");
  const jmuData = await d3.json("data/jmu.json");
  //const data = forDiagram1(jmuData); //SWITCH TO DIAGRAM 1
  //const data = forDiagram2(jmuData); //SWITCH TO DIAGRAM 2
  //const data = forDiagram3(jmuData); //SWITCH TO DIAGRAM 3
  const data = forDiagram4(jmuData); //SWITCH TO DIAGRAM 4

  console.log('data', data);
  // Applies it to the data. We make a copy of the nodes and links objects
  // so as to avoid mutating the original.

  const { nodes, links } = sankey({
  // const tmp = sankey({
    nodes: data.nodes.map(d => Object.assign({}, d)),
    links: data.links.map(d => Object.assign({}, d))
  });

  // Defines a color scale.
  const color = d3.scaleOrdinal(d3.schemeCategory10);

  // Creates the rects that represent the nodes.
  const rect = svg.append("g")
    .attr("stroke", "#000")
    .selectAll()
    .data(nodes)
    .join("rect")
    .attr("x", d => d.x0)
    .attr("y", d => d.y0)
    .attr("height", d => d.y1 - d.y0)
    .attr("width", d => d.x1 - d.x0)
    .attr("fill", d => color(d.category));

  // Adds a title on the nodes.
  rect.append("title")
    .text(d => {
      console.log('d', d);
      return `${d.name}\n${format(d.value)}`});

  // Creates the paths that represent the links.
  const link = svg.append("g")
    .attr("fill", "none")
    .attr("stroke-opacity", 0.5)
    .selectAll()
    .data(links)
    .join("g")
    .style("mix-blend-mode", "multiply");

  // Creates a gradient, if necessary, for the source-target color option.
  if (linkColor === "source-target") {
    const gradient = link.append("linearGradient")
      .attr("id", d => (d.uid = `link-${d.index}`))
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", d => d.source.x1)
      .attr("x2", d => d.target.x0);
    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", d => color(d.source.category));
    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", d => color(d.target.category));
  }

  link.append("path")
    .attr("d", d3Sankey.sankeyLinkHorizontal())
    .attr("stroke", linkColor === "source-target" ? (d) => `url(#${d.uid})`
      : linkColor === "source" ? (d) => color(d.source.category)
        : linkColor === "target" ? (d) => color(d.target.category)
          : linkColor)
    .attr("stroke-width", d => Math.max(1, d.width));

  link.append("title")
    .text(d => `${d.source.name} → ${d.target.name}\n${format(d.value)}`);

  // Adds labels on the nodes.
  svg.append("g")
    .selectAll()
    .data(nodes)
    .join("text")
    .attr("x", d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
    .attr("y", d => (d.y1 + d.y0) / 2)
    .attr("dy", "0.35em")
    .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
    .text(d => d.title);

    // Adds labels on the links.
  svg.append("g")
    .selectAll()
    .data(links)
    .join("text")
    .attr("x", d => {
      console.log('linkd', d)
      const midX = (d.source.x1 + d.target.x0) / 2;
      return midX < width / 2 ? midX + 6 : midX - 6
    })
    .attr("y", d => (d.y1 + d.y0) / 2)
    .attr("dy", "0.35em")
    .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
    .text(d => {
      console.log('linkd', d);
      return `${d.source.title} → ${d.value} → ${d.target.title}`
    });

  const svgNode = svg.node();
    document.body.appendChild(svgNode);
  return svgNode;
}

init();
