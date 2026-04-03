const fs = require('fs');
const path = require('path');

const membersPath = path.join(__dirname, 'members.json');
const members = JSON.parse(fs.readFileSync(membersPath, 'utf8'));

const keepC4Names = [
    "稲村芭菜",
    "宇田川雄基",
    "大槻諒",
    "沖本宗礼",
    "小野口力",
    "尾立蒼馬",
    "梶谷駿登",
    "川上雄之助",
    "川田優花",
    "齊暁彦",
    "佐藤愉太",
    "佐野薫",
    "田丸和貴",
    "茅野明秀",
    "中島嶺央",
    "藤本珠々",
    "古田望",
    "安田悠人",
    "山口悠翔",
    "湯田真人",
    "秋山雄一",
    "上原大翔",
    "堀間涼太"
];

const newMembers = members.filter(member => {
    if (member.year === 'C4') {
        return keepC4Names.includes(member.name);
    }
    return true; // Keep non-C4 members
});

fs.writeFileSync(membersPath, JSON.stringify(newMembers, null, 2), 'utf8');

console.log(`Updated members.json. Removed ${members.length - newMembers.length} members.`);
