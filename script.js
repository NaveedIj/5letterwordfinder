const WORD_LENGTH = parseInt(document.body.dataset.wordLength || '5', 10) || 5;
const IS_WORDLE_LENGTH = WORD_LENGTH === 5;

const charInputs = Array.from(document.querySelectorAll('.char-input'));
const wrongPosInputs = Array.from(document.querySelectorAll('.wrong-pos-input'));
const excludesInput = document.getElementById('excludes');
const mustIncludeInput = document.getElementById('mustInclude');
const repeatSensitiveInput = document.getElementById('repeatSensitive');
const resetBtn = document.getElementById('resetBtn');
const findBtn = document.getElementById('findBtn');
const resultsList = document.getElementById('resultsList');
const resultsCount = document.getElementById('resultsCount');
const copyBtn = document.getElementById('copyBtn');
const toast = document.getElementById('toast');
const statWordCount = document.getElementById('statWordCount');
const sortSelect = document.getElementById('sortSelect');
const showScrabbleInput = document.getElementById('showScrabble');

const wordleList = ["aback","abase","abate","abbey","abbot","abhor","abide","abled","abode","abort","about","above","abuse","abyss","acorn","acrid","actor","acute","adage","adapt","adept","admin","admit","adobe","adopt","adore","adorn","adult","affix","afire","afoot","afoul","after","again","agape","agate","agent","agile","aging","aglow","agony","agora","agree","ahead","aider","aisle","alarm","album","alert","algae","alibi","alien","align","alike","alive","allay","alley","allot","allow","alloy","aloft","alone","along","aloof","aloud","alpha","altar","alter","amass","amaze","amber","amble","amend","amiss","amity","among","ample","amply","amuse","angel","anger","angle","angry","angst","anime","ankle","annex","annoy","annul","anode","antic","anvil","aorta","apart","aphid","aping","apnea","apple","apply","apron","aptly","arbor","ardor","arena","argue","arise","armor","aroma","arose","array","arrow","arson","artsy","ascot","ashen","aside","askew","assay","asset","atoll","atone","attic","audio","audit","augur","aunty","avail","avert","avian","avoid","await","awake","award","aware","awash","awful","awoke","axial","axiom","axion","azure","bacon","badge","badly","bagel","baggy","baker","baler","balmy","banal","banjo","barge","baron","basal","basic","basil","basin","basis","baste","batch","bathe","baton","batty","bawdy","bayou","beach","beady","beard","beast","beech","beefy","befit","began","begat","beget","begin","begun","being","belch","belie","belle","belly","below","bench","beret","berry","berth","beset","betel","bevel","bezel","bible","bicep","biddy","bigot","bilge","billy","binge","bingo","biome","birch","birth","bison","bitty","black","blade","blame","bland","blank","blare","blast","blaze","bleak","bleat","bleed","bleep","blend","bless","blimp","blind","blink","bliss","blitz","bloat","block","bloke","blond","blood","bloom","blown","bluer","bluff","blunt","blurb","blurt","blush","board","boast","bobby","boney","bongo","bonus","booby","boost","booth","booty","booze","boozy","borax","borne","bosom","bossy","botch","bough","boule","bound","bowel","boxer","brace","braid","brain","brake","brand","brash","brass","brave","bravo","brawl","brawn","bread","break","breed","briar","bribe","brick","bride","brief","brine","bring","brink","briny","brisk","broad","broil","broke","brood","brook","broom","broth","brown","brunt","brush","brute","buddy","budge","buggy","bugle","build","built","bulge","bulky","bully","bunch","bunny","burly","burnt","burst","bused","bushy","butch","butte","buxom","buyer","bylaw","cabal","cabin","cable","cacao","cache","cacti","caddy","cadet","cagey","cairn","camel","cameo","canal","candy","canny","canoe","canon","caper","caput","carat","cargo","carol","carry","carve","caste","catch","cater","catty","caulk","cause","cavil","cease","cedar","cello","chafe","chaff","chain","chair","chalk","champ","chant","chaos","chard","charm","chart","chase","chasm","cheap","cheat","check","cheek","cheer","chess","chest","chick","chide","chief","child","chili","chill","chime","china","chirp","chock","choir","choke","chord","chore","chose","chuck","chump","chunk","churn","chute","cider","cigar","cinch","circa","civic","civil","clack","claim","clamp","clang","clank","clash","clasp","class","clean","clear","cleat","cleft","clerk","click","cliff","climb","cling","clink","cloak","clock","clone","close","cloth","cloud","clout","clove","clown","cluck","clued","clump","clung","coach","coast","cobra","cocoa","colon","color","comet","comfy","comic","comma","conch","condo","conic","copse","coral","corer","corny","couch","cough","could","count","coupe","court","coven","cover","covet","covey","cower","coyly","crack","craft","cramp","crane","crank","crash","crass","crate","crave","crawl","craze","crazy","creak","cream","credo","creed","creek","creep","creme","crepe","crept","cress","crest","crick","cried","crier","crime","crimp","crisp","croak","cock","crone","crony","crook","cross","croup","crowd","crown","crude","cruel","crumb","crump","crush","crust","crypt","cubic","cumin","curio","curly","curry","curse","curve","curvy","cutie","cyber","cycle","cynic","daddy","daily","dairy","daisy","dally","dance","dandy","datum","daunt","dealt","death","debar","debit","debug","debut","decal","decay","decor","decoy","decry","defer","deign","deity","delay","delta","delve","demon","demur","denim","dense","depot","depth","derby","deter","detox","deuce","devil","diary","dicey","digit","dilly","dimly","diner","dingo","dingy","diode","dirge","dirty","disco","ditch","ditto","ditty","diver","dizzy","dodge","dodgy","dogma","doing","dolly","donor","donut","dopey","doubt","dough","dowdy","dowel","downy","dowry","dozen","draft","drain","drake","drama","drank","drape","drawl","drawn","dread","dream","dress","dried","drier","drift","drill","drink","drive","droit","droll","drone","drool","droop","dross","drove","drown","druid","drunk","dryer","dryly","duchy","dully","dummy","dumpy","dunce","dusky","dusty","dutch","duvet","dwarf","dwell","dwelt","dying","eager","eagle","early","earth","easel","eaten","eater","ebony","eclat","edict","edify","eerie","egret","eight","eject","eking","elate","elbow","elder","elect","elegy","elfin","elide","elite","elope","elude","email","embed","ember","emcee","empty","enact","endow","enema","enemy","enjoy","ennui","ensue","enter","entry","envoy","epoch","epoxy","equal","equip","erase","erect","erode","error","erupt","essay","ester","ether","ethic","ethos","etude","evade","event","every","evict","evoke","exact","exalt","excel","exert","exile","exist","expel","extol","extra","exult","eying","fable","facet","faint","fairy","faith","false","fancy","fanny","farce","fatal","fatty","fault","fauna","favor","feast","fecal","feign","fella","felon","femme","femur","fence","feral","ferry","fetal","fetch","fetid","fetus","fever","fewer","fiber","fibre","ficus","field","fiend","fiery","fifth","fifty","fight","filer","filet","filly","filmy","filth","final","finch","finer","first","fishy","fixer","fizzy","fjord","flack","flail","flair","flake","flaky","flame","flank","flare","flash","flask","fleck","fleet","flesh","flick","flier","fling","flint","flirt","float","flock","flood","floor","flora","floss","flour","flout","flown","fluff","fluid","fluke","flume","flung","flunk","flush","flute","flyer","foamy","focal","focus","foggy","foist","folio","folly","foray","force","forge","forgo","forte","forth","forty","forum","found","foyer","frail","frame","frank","fraud","freak","freed","freer","fresh","friar","fried","frill","frisk","fritz","frock","frond","front","frost","froth","frown","froze","fruit","fudge","fugue","fully","fungi","funky","funny","furor","furry","fussy","fuzzy","gaffe","gaily","gamer","gamma","gamut","gassy","gaudy","gauge","gaunt","gauze","gavel","gawky","gayer","gayly","gazer","gecko","geeky","geese","genie","genre","ghost","ghoul","giant","giddy","gipsy","girly","girth","given","giver","glade","gland","glare","glass","glaze","gleam","glean","glide","glint","gloat","globe","gloom","glory","gloss","glove","glyph","gnash","gnome","godly","going","golem","golly","gonad","goner","goody","gooey","goofy","goose","gorge","gouge","gourd","grace","grade","graft","grail","grain","grand","grant","grape","graph","grasp","grass","grate","grave","gravy","graze","great","greed","green","greet","grief","grill","grime","grimy","grind","gripe","groan","groin","groom","grope","gross","group","grout","grove","growl","grown","gruel","gruff","grunt","guard","guava","guess","guest","guide","guild","guile","guilt","guise","gulch","gully","gumbo","gummy","guppy","gusto","gusty","gypsy","habit","hairy","halve","handy","happy","hardy","harem","harpy","harry","harsh","haste","hasty","hatch","hater","haunt","haute","haven","havoc","hazel","heady","heard","heart","heath","heave","heavy","hedge","hefty","heist","helix","hello","hence","heron","hilly","hinge","hippo","hippy","hitch","hoard","hobby","hoist","holly","homer","honey","honor","horde","horny","horse","hotel","hotly","hound","house","hovel","hover","howdy","human","humid","humor","humph","humus","hunch","hunky","hurry","husky","hussy","hutch","hydro","hyena","hymen","hyper","icily","icing","ideal","idiom","idiot","idler","idyll","igloo","iliac","image","imbue","impel","imply","inane","inbox","incur","index","inept","inert","infer","ingot","inlay","inlet","inner","input","inter","intro","ionic","irate","irony","islet","issue","itchy","ivory","jaunt","jazzy","jelly","jerky","jetty","jewel","jiffy","joint","joist","joker","jolly","joust","judge","juice","juicy","jumbo","jumpy","junta","junto","juror","kappa","karma","kayak","kebab","khaki","kinky","kiosk","kitty","knack","knave","knead","kneed","kneel","knelt","knife","knock","knoll","known","koala","krill","label","labor","laden","ladle","lager","lance","lanky","lapel","lapse","large","larva","lasso","latch","later","lathe","latte","laugh","layer","leach","leafy","leaky","leant","leapt","learn","lease","leash","least","leave","ledge","leech","leery","lefty","legal","leggy","lemon","lemur","leper","level","lever","libel","liege","light","liken","lilac","limbo","limit","linen","liner","lingo","lipid","lithe","liver","livid","llama","loamy","loath","lobby","local","locus","lodge","lofty","logic","login","loopy","loose","lorry","loser","louse","lousy","lover","lower","lowly","loyal","lucid","lucky","lumen","lumpy","lunar","lunch","lunge","lupus","lurch","lurid","lusty","lying","lymph","lynch","lyric","macaw","macho","macro","madam","madly","mafia","magic","magma","maize","major","maker","mambo","mamma","mammy","manga","mange","mango","mangy","mania","manic","manly","manor","maple","march","marry","marsh","mason","masse","match","matey","mauve","maxim","maybe","mayor","mealy","meant","meaty","mecca","medal","media","medic","melee","melon","mercy","merge","merit","merry","metal","meter","metro","micro","midge","midst","might","milky","mimic","mince","miner","minim","minor","minty","minus","mirth","miser","missy","mocha","modal","model","modem","mogul","moist","molar","moldy","money","month","moody","moose","moral","moron","morph","mossy","motel","motif","motor","motto","moult","mound","mount","mourn","mouse","mouth","mover","movie","mower","mucky","mucus","muddy","mulch","mummy","munch","mural","murky","mushy","music","musky","musty","myrrh","nadir","naive","nanny","nasal","nasty","natal","naval","navel","needy","neigh","nerdy","nerve","never","newer","newly","nicer","niche","niece","night","ninja","ninny","ninth","noble","nobly","noise","noisy","nomad","noose","north","nosey","notch","novel","nudge","nurse","nutty","nylon","nymph","oaken","obese","occur","ocean","octet","octet","odder","oddly","offal","offer","often","olden","older","olive","ombre","omega","onion","onset","opera","opine","opium","optic","orbit","order","organ","other","otter","ought","ounce","outdo","outer","outgo","ovary","ovate","overt","ovine","ovoid","owing","owner","oxide","ozone","paddy","pagan","paint","paler","palsy","panel","panic","pansy","papal","paper","parer","parka","parry","parse","party","pasta","paste","pasty","patch","patio","patsy","patty","pause","payee","payer","peace","peach","pearl","pecan","pedal","penal","pence","penne","penny","perch","peril","perky","pesky","pesto","petal","petty","phase","phone","phony","photo","piano","picky","piece","piety","piggy","pilot","pinch","piney","pinky","pinto","piper","pique","pitch","pithy","pivot","pixel","pixie","pizza","place","plaid","plain","plait","plane","plank","plant","plate","plaza","plead","pleat","plied","plier","pluck","plumb","plume","plump","plunk","plush","poesy","point","poise","poker","polar","polka","polyp","pooch","poppy","porch","poser","posit","posse","pouch","pound","pouty","power","prank","prawn","preen","press","price","prick","pride","pried","prime","primo","print","prior","prism","privy","prize","probe","prone","prong","proof","prose","proud","prove","prowl","proxy","prude","prune","psalm","pubic","pudgy","puffy","pulpy","pulse","punch","pupal","pupil","puppy","puree","purer","purge","purse","pushy","putty","pygmy","quack","quail","quake","qualm","quark","quart","quash","quasi","queen","queer","quell","query","quest","queue","quick","quiet","quill","quilt","quirk","quite","quota","quote","quoth","rabbi","rabid","racer","radar","radii","radio","rainy","raise","rajah","rally","ralph","ramen","ranch","randy","range","rapid","rarer","raspy","ratio","ratty","raven","rayon","razor","reach","react","ready","realm","rearm","rebar","rebel","rebus","rebut","recap","recur","recut","reedy","refer","refit","regal","rehab","reign","relax","relay","relic","remit","renal","renew","repay","repel","reply","rerun","reset","resin","retch","retro","retry","reuse","revel","revue","rhino","rhyme","rider","ridge","rifle","right","rigid","rigor","rinse","ripen","riper","risen","riser","risky","rival","river","rivet","roach","roast","robin","robot","rocky","rodeo","roger","rogue","roomy","roost","rotor","rouge","rough","round","rouse","route","rover","rowdy","rower","royal","ruddy","ruder","rugby","ruler","rumba","rumor","rupee","rural","rusty","sadly","safer","saint","salad","sally","salon","salsa","salty","salve","salvo","sandy","saner","sappy","sassy","satin","satyr","sauce","saucy","sauna","saute","savor","savoy","savvy","scald","scale","scalp","scaly","scamp","scant","scare","scarf","scary","scene","scent","scion","scoff","scold","scone","scoop","scope","score","scorn","scour","scout","scowl","scram","scrap","scree","screw","scrub","scrum","scuba","sedan","seedy","segue","seize","semen","sense","sepia","serif","serum","serve","setup","seven","sever","sewer","shack","shade","shady","shaft","shake","shaky","shale","shall","shalt","shame","shank","shape","shard","share","shark","sharp","shave","shawl","shear","sheen","sheep","sheer","sheet","sheik","shelf","shell","shied","shift","shine","shiny","shire","shirk","shirt","shoal","shock","shone","shook","shoot","shore","shorn","short","shout","shove","shown","showy","shrew","shrub","shrug","shuck","shunt","shush","shyly","siege","sieve","sight","sigma","silky","silly","since","sinew","singe","siren","sissy","sixth","sixty","skate","skier","skiff","skill","skimp","skirt","skulk","skull","skunk","slack","slain","slang","slant","slash","slate","slave","sleek","sleep","sleet","slept","slice","slick","slide","slime","slimy","sling","slink","sloop","slope","slosh","sloth","slump","slung","slunk","slurp","slush","slyly","smack","small","smart","smash","smear","smell","smelt","smile","smirk","smite","smith","smock","smoke","smoky","smote","snack","snail","snake","snaky","snare","snarl","sneak","sneer","snide","sniff","snipe","snoop","snore","snort","snout","snowy","snuck","snuff","soapy","sober","soggy","solar","solid","solve","sonar","sonic","sooth","sooty","sorry","sound","south","sower","space","spade","spank","spare","spark","spasm","spawn","speak","spear","speck","speed","spell","spelt","spend","spent","sperm","spice","spicy","spied","spiel","spike","spiky","spill","spilt","spine","spiny","spire","spite","splat","split","spoil","spoke","spoof","spook","spool","spoon","spore","sport","spout","spray","spree","sprig","spunk","spurn","spurt","squad","squat","squib","stack","staff","stage","staid","stain","stair","stake","stale","stalk","stall","stamp","stand","stank","stare","stark","start","stash","state","stave","stead","steak","steal","steam","steed","steel","steep","steer","stein","stern","stick","stiff","still","stilt","sting","stink","stint","stock","stoic","stoke","stole","stomp","stone","stony","stood","stool","stoop","store","stork","storm","story","stout","stove","strap","straw","stray","strip","strut","stuck","study","stuff","stump","stung","stunk","stunt","style","suave","sugar","suing","suite","sulky","sully","sumac","sunny","super","surer","surge","surly","sushi","swami","swamp","swarm","swash","swath","swear","sweat","sweep","sweet","swell","swept","swift","swill","swine","swing","swirl","swish","swoon","swoop","sword","swore","sworn","swung","synod","syrup","tabby","table","taboo","tacit","tacky","taffy","taint","taken","taker","tally","talon","tamer","tango","tangy","taper","tapir","tardy","tarot","taste","tasty","tatty","taunt","tawny","teach","teary","tease","teddy","teeth","tempo","tenet","tenor","tense","tenth","tepee","tepid","terra","terse","testy","thank","theft","their","theme","there","these","theta","thick","thief","thigh","thing","think","third","thong","thorn","those","three","threw","throb","throw","thrum","thumb","thump","thyme","tiara","tibia","tidal","tiger","tight","tilde","timer","timid","tipsy","titan","tithe","title","toast","today","toddy","token","tonal","tonga","tonic","tooth","topaz","topic","torch","torso","torus","total","totem","touch","tough","towel","tower","toxic","toxin","trace","track","tract","trade","trail","train","trait","tramp","trash","trawl","tread","treat","trend","triad","trial","tribe","trice","trick","tried","tripe","trite","troll","troop","trope","trout","trove","truce","truck","truer","truly","trump","trunk","truss","trust","truth","tryst","tubal","tuber","tulip","tulle","tumor","tunic","turbo","tutor","twang","tweak","tweed","tweet","twice","twine","twirl","twist","twixt","tying","udder","ulcer","ultra","umbra","uncle","uncut","under","undid","undue","unfed","unfit","unify","union","unite","unity","unlit","unmet","unset","untie","until","unwed","unzip","upper","upset","urban","urine","usage","usher","using","usual","usurp","utile","utter","vague","valet","valid","valor","value","valve","vapid","vapor","vault","vaunt","vegan","venom","venue","verge","verse","verso","verve","vicar","video","vigil","vigor","villa","vinyl","viola","viper","viral","virus","visit","visor","vista","vital","vivid","vixen","vocal","vodka","vogue","voice","voila","vomit","voter","vouch","vowel","vying","wacky","wafer","wager","wagon","waist","waive","waltz","warty","waste","watch","water","waver","waxen","weary","weave","wedge","weedy","weigh","weird","welch","welsh","wench","whack","whale","wharf","wheat","wheel","whelp","where","which","whiff","while","whine","whiny","whirl","whisk","white","whole","whoop","whose","widen","wider","widow","width","wield","wight","willy","wimpy","wince","winch","windy","wiser","wispy","witch","witty","woken","woman","women","woody","wooer","wooly","woozy","wordy","world","worry","worse","worst","worth","would","wound","woven","wrack","wrath","wreak","wreck","wrest","wring","wrist","write","wrong","wrote","wrung","wryly","yacht","yearn","yeast","yield","young","youth","zebra","zesty","zonal"];
const fullList = typeof wordList !== 'undefined' ? wordList : [];
let activeList = [];
let currentResults = [];
let currentDict = IS_WORDLE_LENGTH ? 'wordle' : 'full';

if (typeof wordList !== 'undefined') {
    if (IS_WORDLE_LENGTH) {
        activeList = currentDict === 'wordle' ? wordleList : fullList;
    } else {
        activeList = fullList;
    }
    console.log("Loaded words:", wordList.length);
    console.log(`Active list for ${WORD_LENGTH} letters:`, activeList.length);
}




const dictToggle = document.getElementById('dictToggle');
const dictCard = document.getElementById('dictCard');
const playWordleCard = document.querySelector('.play-wordle-card');
const letterTracker = document.getElementById('letterTracker');

const menuBtn = document.getElementById('menuBtn');
const navPanel = document.getElementById('navPanel');
const navOverlay = document.getElementById('navOverlay');
const closeNavBtn = document.getElementById('closeNavBtn');
const darkModeToggle = document.getElementById('darkModeToggle');

const helpBtn = document.getElementById('helpBtn');
const helpModal = document.getElementById('helpModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const modalOverlay = document.getElementById('modalOverlay');

const SCRABBLE = {
    A: 1, B: 3, C: 3, D: 2, E: 1, F: 4, G: 2, H: 4, I: 1, J: 8, K: 5, L: 1, M: 3,
    N: 1, O: 1, P: 3, Q: 10, R: 1, S: 1, T: 1, U: 1, V: 4, W: 4, X: 8, Y: 4, Z: 10
};

function scrabbleScore(word) {
    let s = 0;
    for (const c of word.toUpperCase()) {
        if (SCRABBLE[c] !== undefined) s += SCRABBLE[c];
    }
    return s;
}

function countLetters(str) {
    const o = {};
    for (const c of str) {
        if (/[A-Z]/.test(c)) o[c] = (o[c] || 0) + 1;
    }
    return o;
}

function mergeCounts(a, b) {
    const o = { ...a };
    for (const [k, v] of Object.entries(b)) {
        o[k] = (o[k] || 0) + v;
    }
    return o;
}


const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
let trackerState = {};


function parseMustInclude(raw) {
    return countLetters(raw.toUpperCase().replace(/[^A-Z]/g, ''));
}

function yellowMultiset(wrongPosArr) {
    const o = {};
    for (const chars of wrongPosArr) {
        for (const c of (chars || '').toUpperCase()) {
            if (/[A-Z]/.test(c)) o[c] = (o[c] || 0) + 1;
        }
    }
    return o;
}

function greenCountsFromPattern(pattern) {
    const o = {};
    for (let i = 0; i < WORD_LENGTH; i++) {
        const p = pattern[i];
        if (p !== '_' && p !== '?' && /[A-Z]/.test(p)) o[p] = (o[p] || 0) + 1;
    }
    return o;
}

function meetsMinimumCounts(upperWord, minimums) {
    const wc = countLetters(upperWord);
    for (const [c, need] of Object.entries(minimums)) {
        if ((wc[c] || 0) < need) return false;
    }
    return true;
}

function getEffectiveExcludes(excludeList, pattern, wrongPosArr, mustIncludeCounts) {
    const required = new Set();
    for (let i = 0; i < WORD_LENGTH; i++) {
        const p = pattern[i];
        if (p !== '_' && p !== '?' && /[A-Z]/.test(p)) required.add(p);
    }
    for (const chars of wrongPosArr) {
        for (const c of (chars || '').toUpperCase()) {
            if (/[A-Z]/.test(c)) required.add(c);
        }
    }
    for (const c of Object.keys(mustIncludeCounts)) required.add(c);
    return excludeList.filter(c => !required.has(c));
}

function updateResults() {
    console.log("updateResults triggered");
    const pattern = charInputs.map(input => input.value.toUpperCase().trim() || '_').join('');
    const wrongPosArr = wrongPosInputs.map(input => input.value.toUpperCase().trim());
    const repeatSensitive = repeatSensitiveInput ? repeatSensitiveInput.checked : true;

    const mustIncludeCounts = mustIncludeInput ? parseMustInclude(mustIncludeInput.value) : {};

    const excludesRaw = excludesInput.value.toUpperCase().trim();
    const excludesAll = [...new Set(excludesRaw.split('').filter(c => /[A-Z]/.test(c)))];
    const greens = greenCountsFromPattern(pattern);
    const effectiveExcludes = getEffectiveExcludes(excludesAll, pattern, wrongPosArr, mustIncludeCounts);

    const sourcePool = activeList;

    const yellowUnique = [...new Set(wrongPosArr.join('').split('').filter(c => /[A-Z]/.test(c)))];

    let minimums;
    if (repeatSensitive) {
        const yellows = yellowMultiset(wrongPosArr);
        minimums = mergeCounts(mergeCounts(greens, yellows), mustIncludeCounts);
    } else {
        minimums = mergeCounts({ ...greens }, mustIncludeCounts);
        for (const c of yellowUnique) {
            minimums[c] = Math.max(minimums[c] || 0, (greens[c] || 0) + 1);
        }
    }

    currentResults = sourcePool.filter(word => {
        const upperWord = word.toUpperCase();
        if (upperWord.length !== WORD_LENGTH) return false;

        for (let i = 0; i < WORD_LENGTH; i++) {
            const pChar = pattern[i];
            if (pChar !== '_' && pChar !== '?' && pChar !== upperWord[i]) return false;
        }

        for (let i = 0; i < WORD_LENGTH; i++) {
            const chars = wrongPosArr[i];
            if (chars) {
                for (const c of chars) {
                    if (/[A-Z]/.test(c) && upperWord[i] === c) return false;
                }
            }
        }

        if (!meetsMinimumCounts(upperWord, minimums)) return false;

        for (const char of effectiveExcludes) {
            if (upperWord.includes(char)) return false;
        }

        return true;
    });

    sortResults();
    updateTracker(yellowUnique, effectiveExcludes);
    renderResults(pattern);
}

function sortResults() {
    const mode = sortSelect ? sortSelect.value : 'alpha-asc';
    const arr = [...currentResults];
    if (mode === 'alpha-asc') {
        arr.sort((a, b) => a.localeCompare(b));
    } else if (mode === 'alpha-desc') {
        arr.sort((a, b) => b.localeCompare(a));
    } else if (mode === 'score-desc') {
        arr.sort((a, b) => scrabbleScore(b) - scrabbleScore(a) || a.localeCompare(b));
    } else if (mode === 'score-asc') {
        arr.sort((a, b) => scrabbleScore(a) - scrabbleScore(b) || a.localeCompare(b));
    }
    currentResults = arr;
}

function updateTracker(includes, excludes) {
    trackerState = {};
    includes.forEach(c => { trackerState[c] = 'included'; });
    excludes.forEach(c => { trackerState[c] = 'excluded'; });
    renderTracker();
}

function renderResults(pattern = '') {
    const showScores = showScrabbleInput ? showScrabbleInput.checked : false;

    if (!hasAnyFilter() || currentResults.length === 0) {
        resultsList.innerHTML = `
            <div class="empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <p>${hasAnyFilter() ? 'No matching words. Loosen a filter or toggle repeat-aware.' : 'Type letters above — results update as you go.'}</p>
            </div>
        `;
        copyBtn.disabled = true;
    } else {
        const limit = currentDict === 'strict' ? 200 : 1000;
        const displayResults = currentResults.slice(0, limit);
        const wordGrid = displayResults.map(word => {
            const upperWord = word.toUpperCase();
            let highlightedWord = '';
            for (let i = 0; i < WORD_LENGTH; i++) {
                const isMatch = pattern && pattern[i] && pattern[i] !== '_' && pattern[i] !== '?' && pattern[i].toUpperCase() === upperWord[i];
                if (isMatch) {
                    highlightedWord += `<span class="char-match">${upperWord[i]}</span>`;
                } else {
                    highlightedWord += upperWord[i];
                }
            }
            const score = scrabbleScore(word);
            const scoreHtml = showScores ? `<span class="word-score" title="Scrabble face value">${score}</span>` : '';
            return `<div class="word-item" data-word="${upperWord}" title="Click to copy">${highlightedWord}${scoreHtml}</div>`;
        }).join('');

        resultsList.innerHTML = wordGrid;
        copyBtn.disabled = false;
    }

    const countText = `${currentResults.length.toLocaleString()} word${currentResults.length !== 1 ? 's' : ''}`;
    resultsCount.textContent = currentResults.length > (currentDict === 'strict' ? 200 : 1000) ? `${countText} (showing first ${currentDict === 'strict' ? 200 : 1000})` : countText;
}

function renderTracker() {
    if (!letterTracker) return;
    letterTracker.innerHTML = alphabet.map(char => {
        const state = trackerState[char] || '';
        return `<div class="tracker-letter ${state}">${char}</div>`;
    }).join('');
}

function hasAnyFilter() {
    return charInputs.some(input => input.value.trim()) ||
           wrongPosInputs.some(input => input.value.trim()) ||
           (mustIncludeInput && mustIncludeInput.value.trim()) ||
           excludesInput.value.trim();
}

function resetFilters() {
    charInputs.forEach(input => { input.value = ''; });
    wrongPosInputs.forEach(input => { input.value = ''; });
    excludesInput.value = '';
    if (mustIncludeInput) mustIncludeInput.value = '';
    if (repeatSensitiveInput) repeatSensitiveInput.checked = true;
    updateResults();
    charInputs[0].focus();
}

function copyResults() {
    if (currentResults.length === 0) return;
    const text = currentResults.join(', ');
    copyToClipboard(text, 'Copied all results!');
}

function copyToClipboard(text, successMsg) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            showToast(successMsg);
        }).catch(() => fallbackCopy(text, successMsg));
    } else {
        fallbackCopy(text, successMsg);
    }
}

function fallbackCopy(text, successMsg) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
        document.execCommand('copy');
        showToast(successMsg);
    } catch (err) {
        showToast('Copy failed');
    }
    document.body.removeChild(textarea);
}

function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
}

function toggleTheme(e) {
    const isDark = e.target.checked;
    document.body.classList.remove('theme-dark', 'theme-light');
    document.body.classList.add(isDark ? 'theme-dark' : 'theme-light');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    darkModeToggle.checked = isDark;
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);

    document.body.classList.remove('theme-dark', 'theme-light');
    document.body.classList.add(isDark ? 'theme-dark' : 'theme-light');
    darkModeToggle.checked = isDark;
}

function toggleNav(open) {
    navPanel.classList.toggle('active', open);
    navOverlay.classList.toggle('active', open);
}

function wireCharInputs() {
    const last = charInputs.length - 1;
    charInputs.forEach((input, index) => {
        input.addEventListener('input', (e) => {
            const val = e.target.value.toUpperCase().replace(/[^A-Z]/g, '');
            e.target.value = val;

            if (val && index < last) {
                charInputs[index + 1].focus();
            }
            updateResults();
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !e.target.value && index > 0) {
                charInputs[index - 1].focus();
            }
        });
    });
}

function wireWrongInputs() {
    const last = wrongPosInputs.length - 1;
    wrongPosInputs.forEach((input, index) => {
        input.addEventListener('input', (e) => {
            const val = e.target.value.toUpperCase().replace(/[^A-Z]/g, '');
            e.target.value = val;

            if (val.length === 1 && index < last) {
                wrongPosInputs[index + 1].focus();
            }
            updateResults();
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !e.target.value && index > 0) {
                wrongPosInputs[index - 1].focus();
            }
        });
    });
}

[excludesInput, mustIncludeInput].forEach(el => {
    if (el) {
        el.addEventListener('input', (e) => {
            e.target.value = e.target.value.toUpperCase().replace(/[^A-Z]/g, '');
            updateResults();
        });
    }
});

if (repeatSensitiveInput) {
    repeatSensitiveInput.addEventListener('change', () => updateResults());
}

function toggleModal(show) {
    if (show) {
        helpModal.classList.add('show');
        helpModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    } else {
        helpModal.classList.remove('show');
        helpModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }
}

if (helpBtn) helpBtn.addEventListener('click', () => toggleModal(true));
if (closeModalBtn) closeModalBtn.addEventListener('click', () => toggleModal(false));
if (modalOverlay) modalOverlay.addEventListener('click', () => toggleModal(false));

window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && helpModal.classList.contains('show')) {
        toggleModal(false);
    }
});

if (resetBtn) resetBtn.addEventListener('click', resetFilters);
if (findBtn) {
    findBtn.addEventListener('click', () => {
        updateResults();
        resultsList?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
}
if (copyBtn) copyBtn.addEventListener('click', copyResults);
if (darkModeToggle) darkModeToggle.addEventListener('change', toggleTheme);

if (menuBtn) menuBtn.addEventListener('click', () => toggleNav(true));
if (closeNavBtn) closeNavBtn.addEventListener('click', () => toggleNav(false));
if (navOverlay) navOverlay.addEventListener('click', () => toggleNav(false));

if (dictToggle && IS_WORDLE_LENGTH) {
    dictToggle.addEventListener('click', (e) => {
        const item = e.target.closest('.toggle-item');
        if (!item) return;

        document.querySelectorAll('#dictToggle .toggle-item').forEach(el => el.classList.remove('active'));
        item.classList.add('active');
        currentDict = item.dataset.dict === 'strict' ? 'wordle' : 'full';
        
        if (currentDict === "wordle") {
            activeList = wordleList;
        } else {
            activeList = fullList;
        }
        updateResults();
    });
}

if (sortSelect) {
    sortSelect.addEventListener('change', () => {
        sortResults();
        const pattern = charInputs.map(input => input.value.toUpperCase().trim() || '_').join('');
        renderResults(pattern);
    });
}

if (showScrabbleInput) {
    showScrabbleInput.addEventListener('change', () => {
        const pattern = charInputs.map(input => input.value.toUpperCase().trim() || '_').join('');
        renderResults(pattern);
    });
}

if (resultsList) {
    resultsList.addEventListener('click', (e) => {
        const wordItem = e.target.closest('.word-item');
        if (wordItem) {
            const text = wordItem.getAttribute('data-word') || wordItem.textContent.replace(/\d+/g, '').trim();
            copyToClipboard(text, `Copied "${text}"!`);
        }
    });
}

window.addEventListener('keydown', (e) => {
    if (e.key === '/' && !charInputs.some(input => document.activeElement === input)) {
        e.preventDefault();
        charInputs[0].focus();
    }
});

function initStats() {
    if (!statWordCount) return;
    let n = 0;
    if (activeList) {
        n = activeList.length;
    }
    statWordCount.textContent = n ? n.toLocaleString() : '—';
}

function initLengthUi() {
    if (!IS_WORDLE_LENGTH) {
        if (dictCard) dictCard.hidden = true;
        if (playWordleCard) playWordleCard.hidden = true;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadTheme();
    initLengthUi();
    initStats();
    wireCharInputs();
    wireWrongInputs();
    updateResults();
    if (charInputs[0]) charInputs[0].focus();

    // Smooth scroll for "Try Tool" button
    document.querySelectorAll('a[href="#tool-section"], a[href="/#tool-section"]').forEach(link => {
        link.addEventListener('click', function (e) {
            const toolSection = document.querySelector('#tool-section');
            if (toolSection) {
                e.preventDefault();
                toolSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Responsive Header Menu Toggle
    const menuToggle = document.querySelector(".menu-toggle");
    const navMenu = document.querySelector(".nav-menu");

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", function () {
            navMenu.classList.toggle("active");
        });

        document.addEventListener("click", function (event) {
            if (!menuToggle.contains(event.target) && !navMenu.contains(event.target)) {
                navMenu.classList.remove("active");
            }
        });
    }
});

// Page-specific Enhancement: Auto-prefill "E" for ending-with-e pages
// Align tool with page intent while maintaining user control
if (window.location.pathname.includes("ending-with-e")) {
    window.addEventListener('load', () => {
        const inputs = document.querySelectorAll('.char-input');
        if (inputs.length > 0) {
            const lastInput = inputs[inputs.length - 1];
            // Prefill only if empty to respect existing user input or focus
            if (!lastInput.value) {
                lastInput.value = 'E';
                // Trigger input event to refresh filtering logic automatically
                lastInput.dispatchEvent(new Event('input', { bubbles: true }));
            }
        }
    });
}

