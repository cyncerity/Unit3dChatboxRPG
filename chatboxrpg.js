// ==UserScript==
// @name         ChatboxRPG
// @namespace    https://upload.cx/users/cyncerity
// @version      0.0.7
// @description  A text-based RPG that progresses based on user activity in the chatbox
// @author       cyncerity
// @match        https://upload.cx/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // --- Selectors ---
    const CHATBOX_HEADER_SELECTOR = '#chatbox_header div';
    const MESSAGES_CONTAINER_SELECTOR = '.chatroom__messages';

    // --- Storage Keys ---
    const STORAGE_COUNT_KEY = 'chatboxRPG_gold';
    const STORAGE_STATS_KEY = 'chatboxRPG_stats';

    // --- Default Stats ---
    const DEFAULT_STATS = {
        level: 1,
        health: 10,
        maxHealth: 10,
        strength: 10,
        toughness: 10,
        ironOre: 0
    };

    const ADDGOLD_TEXT = 'You received 1000 gold pieces.';
  
  //////////////////Explore Flavour Texts///////////////////////////
    const flav_explore_neut = [
        'You search the area but find nothing of interest.',
        'You sift through the underbrush but discover nothing useful.',
        'You examine the clearing but it seems completely barren.',
        'You poke around the trees but find no items worth taking.',
        'You look under the fallen log but it’s empty.',
        'You scan the horizon but see only more trees.',
        'You part the brambles, but they yield no path.',
        'You search a shallow puddle, but the water is clear.',
        'You run your hand along a slick rock, but feel only cold stone.',
        'You shake a low branch, but nothing falls.',
        'You peer into a dry riverbed, but see only sand.',
        'You smell the air, but detect no hint of anything unusual.',
        'You turn over a tangle of vines, but find nothing hidden.',
        'You check a pile of leaves, but uncover no trace.',
        'You listen to the silence, but hear only rustling wind.',
        'You examine a hollow tree, but it’s empty inside.',
        'You sift the soil through your fingers, but it’s just earth.',
        'You sweep aside cobwebs, but nothing is hiding behind.',
        'You brush over a patch of lichen, but it’s just growth.',
        'You inspect a broken branch, but it’s completely bare.'
    ];
  
    const flav_explore_bad = [
        'You trip over a branch and twist your ankle.',
        'You bump your head on a low-hanging branch and see stars.',
        'You get pricked by a hidden thorn, drawing a drop of blood.',
        'You accidentally nick your hand on a jagged rock.',
        'You slip on wet leaves and bruise your side.',
        'You stumble into a thorny bush and scratch your arm.',
        'You lose your footing on loose gravel and scrape your knee.',
        'You knock your elbow against a protruding root.',
        'A wasp stings your shoulder, leaving it red and swollen.',
        'You brush against poison ivy and your skin begins to itch.',
        'You cut your finger on a sharp shard of pottery.',
        'You misjudge a step and land awkwardly, straining your wrist.',
        'A sudden gust of wind throws you off balance, twisting your back.',
        'You catch your foot in a hidden hole, bruising your shin.',
        'You collide with a low rock face, opening a cut on your forehead.',
        'You slip into a muddy patch and pull a muscle in your leg.',
        'A swarm of biting insects descends, leaving welts on your arms.',
        'You bump your head against a hollow tree and feel a sharp pain.',
        'You step on a sharp stick, piercing the sole of your boot.',
        'You get tangled in vines and cut your forearm trying to free yourself.'
    ];
  
    const flav_explore_iron = [
        'You spot a glint of metal and pick up a piece of iron ore.',
        'You pry a chunk of iron ore from the rock face.',
        'You find a small vein of iron ore embedded in the stone.',
        'You scrape off a bit of iron ore from the boulder.',
        'You discover a lump of iron ore half-buried in the dirt.',
        'You uncover a rusty nugget of iron ore beneath the soil.',
        'You detect the metallic scent of iron and unearth a flake of ore.',
        'You extract a dusty fragment of iron ore from the ground.',
        'You tap the rock, hearing a metallic ring, and find a thin vein of ore.',
        'You mine a small cluster of iron ore from the cliff wall.',
        'You dig into the earth, revealing a handful of iron fragments.',
        'You chip off a piece of iron ore from a fractured seam.',
        'You notice a reddish streak in the stone and gather iron bits.',
        'You powder a bit of rusty rock to collect coarse iron ore.',
        'You break open a loose stone to expose iron-rich veins.',
        'You sift through pebbles and pick out a heavy piece of ore.',
        'You split a slab of rock, revealing veins of metallic iron.',
        'You scrape moss from a boulder and uncover hidden ore.',
        'You thrust your pick into a crevice and pry out iron ore.',
        'You search the rubble and recover a solid chunk of iron ore.'
    ];


    const flav_explore_monster = [
        'MONSTER_ENCOUNTER NOT YET IMPLEMENTED',
        'MONSTER_ENCOUNTER NOT YET IMPLEMENTED'
    ];
  ////////////////////////////////////////////////////////////////////

  //////////////////Strength Train Flavour Texts///////////////////////////
    const flav_train_str = [
        'You lift mighty warhammers at the blacksmith\'s forge, feeling each swing strengthen your arms.',
        'You haul heavy crates of supplies up endless castle stairs.',
        'You hoist massive anvils to develop your chest and shoulders.',
        'You swing weighted stones until your forearms burn.',
        'You practice spear thrusts against wooden dummies, powering your core.',
        'You carry sacks of grain across the courtyard for hours.',
        'You throw training javelins at heavy dummies to build raw power.',
        'You wrestle in the mud pits until your muscles ache with vigor.',
        'You row a fishing barge upstream, battling the current to bolster your back.',
        'You heft boulders onto altar platforms to pray for strength.',
        'You push a heavily laden ox cart uphill to test your leg strength.',
        'You squeeze a marble statue of a dragon to test your grip strength.',
        'You swing a chain of linked lanterns like a flail to build forearm power.',
        'You stack and unstack heavy barrels in record time, turning it into a spectator sport.',
        'You lift arcane tomes that resist your weight with enchanted bindings.',
        'You arm-wrestle a stone giant.',
        'You bench-press a panther cub under spellbound weights.',
        'You challenge a rampaging boulder to a push competition and win by a hair.',
        'You do push-ups so fast that sparks fly from the stones beneath your hands.',
        'You lift the entire castle drawbridge single-handedly to test your might.'
    ];
  /////////////////////////////////////////////////////////////////////////

  //////////////////Toughness Train Flavour Texts///////////////////////////
    const flav_train_tough = [
        'You endure ice baths in the frozen lake, hardening your resolve and skin.',
        'You carry sacks of sand on a rickety bridge to test your balance and grit.',
        'You march barefoot on rough cobblestones to strengthen your soles.',
        'You stand under pouring rain with no cloak, building your endurance.',
        'You endure hours of meditation atop a cold mountain ledge.',
        'You wrestle with massive logs until sweat and perseverance prevail.',
        'You hold a heavy hammer above your head, arms trembling but unwavering.',
        'You run laps around the battlements through a chilling wind.',
        'You partake in dawn’s freezing river ritual to steel your lungs.',
        'You pull a loaded wagon uphill, bolstering your stamina.',
        'You hug a petrified oak tree for strength, drawing its ancient toughness.',
        'You crawl through a tunnel of thorny vines without a scratch.',
        'You wear enchanted iron gauntlets to test your resilience.',
        'You let a giant spider crawl over your skin to build nerve.',
        'You stand in front of a roaring forge, letting the heat temper your will.',
        'You let a dragon’s tail flick across your armor, barely flinching.',
        'You withstand a barrage of snowballs thrown by mischievous goblins.',
        'You sit unblinking beneath a waterfall of hot lava (in your imagination).',
        'You challenge a thunderstorm to a staring contest and win.',
        'You hug a fire elemental and absorb its scorching aura without harm.'
    ];
  ////////////////////////////////////////////////////////////////////

  //////////////////Rest Flavour Texts///////////////////////////  
    const flav_rest = [
        'You sink into a soft bed at the inn and awaken fully healed.',
        'You drift off to sleep by the crackling hearth and revive completely by dawn.',
        'The inn’s cozy room envelops you in warmth as you recover all your strength.',
        'You rest peacefully through the night and wake with every wound mended.',
        'You curl up under a thick quilt and rise at first light feeling whole again.',
        'The gentle murmur of the inn lulls you into restorative slumber until morning.',
        'You sleep soundly on a plush mattress and awaken free of any fatigue.',
        'You recline in a feather-stuffed bed and greet the new day fully rejuvenated.',
        'You drift between dreams in the inn’s quiet chambers and heal through the night.',
        'You rest your weary body in a comfortable room and wake at peak vitality.',
        'You surrender to deep sleep by the warm hearth and emerge completely restored.',
        'You lie on soft linens and wake refreshed, every bruise and cut gone.',
        'You dream undisturbed in the inn’s peaceful quarters and rise at full strength.',
        'You slumber in a serene room filled with the scent of fresh linens and heal fully.',
        'The hush of the inn’s corridors grants you a night of perfect rest and renewal.',
        'You close your eyes in a snug bedroll and awaken with energy coursing through you.',
        'You spend the night in the inn’s calm embrace and wake without a care or wound.',
        'You doze by candlelight until morning light and find yourself entirely mended.',
        'You rest on a down-filled pillow and awaken as strong as the day began.',
        'You sleep in the quiet comfort of the inn and greet sunrise with restored health.'
    ];

////////////////////////////////////////////////////////////////////

    // --- State ---
    let gold = 0;
    let stats = {};

    function loadState() {
        gold = parseInt(localStorage.getItem(STORAGE_COUNT_KEY) || '0', 10);
        stats = JSON.parse(localStorage.getItem(STORAGE_STATS_KEY) || 'null') || { ...DEFAULT_STATS };
        stats.ironOre = stats.ironOre || 0;
    }

    function saveState() {
        localStorage.setItem(STORAGE_COUNT_KEY, String(gold));
        localStorage.setItem(STORAGE_STATS_KEY, JSON.stringify(stats));
    }

    function extractUser() {
        const el = document.querySelector('a.top-nav__username--highresolution');
        return el ? el.textContent.trim().toLowerCase() : null;
    }

    function setupMessageObserver() {
        const container = document.querySelector(MESSAGES_CONTAINER_SELECTOR);
        if (!container) return setTimeout(setupMessageObserver, 1000);
        const username = extractUser();
        new MutationObserver(muts => muts.forEach(m => m.addedNodes.forEach(n => {
            if (!(n instanceof Element)) return;
            const author = n.querySelector('.user-tag');
            const content = n.querySelector('.chatbox-message__content');
            if (author && content && author.textContent.trim() === username) {
                gold += content.textContent.length;
                saveState();
                const panel = document.getElementById('charCountPanel');
                if (panel) panel.querySelector('#goldField').textContent = gold;
            }
        }))).observe(container, { childList: true });
    }

    function removePanel() {
        const p = document.getElementById('charCountPanel'); if (p) p.remove();
    }

    function showPanel() {
        removePanel(); loadState();
        const html = `
<section id="charCountPanel" class="panelV2" style="width:300px; position:fixed; top:50px; left:150px; z-index:9999; background:#fff; border:1px solid #000; overflow:auto;">
  <header class="panel__heading"><div class="button-holder no-space"><div class="button-left"><h4 style="text-align:center; width:100%;">ChatboxRPG</h4></div><div class="button-right"><button id="helpBtn" class="form__button form__button--text">Help</button><button id="optionsBtn" class="form__button form__button--text">Options</button><button id="closeBtn" class="form__button form__button--text">Close</button></div></div></header>
  <div class="panel__body" style="padding:10px;">
    <p>Gold: <b id="goldField">${gold}</b></p>
    <p>Level: <b id="levelField">${stats.level}</b></p>
    <p>Health: <b id="healthField">${stats.health}</b> / <b id="maxHealthField">${stats.maxHealth}</b></p>
    <p>Strength: <b id="strengthField">${stats.strength}</b></p>
    <p>Toughness: <b id="toughnessField">${stats.toughness}</b></p>
    <p>Iron Ore: <b id="ironOreField">${stats.ironOre}</b></p>
    <div id="optionsMenu" class="form__group" style="display:none; border-top:1px solid #ccc; margin:10px 0; padding-top:10px;"><button id="restartBtn" class="form__button">Restart Game</button><button id="addGoldBtn" class="form__button">Add 1000gp</button></div>
    <div class="form__group" id="mainActions" style="display:flex; justify-content:space-evenly; border-top:1px solid #ccc; margin:10px 0; padding-top:10px; flex-wrap:wrap;">
      <button id="exploreBtn" class="form__button">Explore (100gp)</button>
      <button id="restBtn" class="form__button">Rest at Inn (100gp)</button>
      <button id="trainStatsBtn" class="form__button">Train Stats</button>
      <button id="declareBtn" class="form__button">Declare!</button>
    </div>
    <div class="form__group" id="trainActions" style="display:none; justify-content:space-evenly; border-top:1px solid #ccc; margin:10px 0; padding-top:10px; flex-wrap:wrap;">
      <button id="trainStrengthBtn" class="form__button">Train Strength (500gp)</button>
      <button id="trainToughnessBtn" class="form__button">Train Toughness (500gp)</button>
      <button id="backBtn" class="form__button">Back</button>
    </div>
    <div id="messageArea" class="form__group" style="display:none; border-top:1px solid #ccc; margin:10px 0; padding:10px; min-height:40px; background:transparent;"></div>
  </div>
</section>`;
        document.body.insertAdjacentHTML('beforeend', html);
        const panel = document.getElementById('charCountPanel');
        const msg = panel.querySelector('#messageArea');
        const goldFld = panel.querySelector('#goldField');
        const healthFld = panel.querySelector('#healthField');
        const strengthFld = panel.querySelector('#strengthField');
        const maxHealthFld = panel.querySelector('#maxHealthField');
        const toughnessFld = panel.querySelector('#toughnessField');
        const ironFld = panel.querySelector('#ironOreField');
        const currentUser = extractUser();

        panel.querySelector('#helpBtn').onclick = () => { msg.style.display = 'block'; msg.textContent = 'Gold is earned each time you send a message in the chatbox. Contact Cyncerity on ULCX for any suggestions.'; };
        panel.querySelector('#optionsBtn').onclick = () => { const m = panel.querySelector('#optionsMenu'); m.style.display = m.style.display === 'none' ? 'block' : 'none'; };
        panel.querySelector('#closeBtn').onclick = removePanel;
        panel.querySelector('#restartBtn').onclick = () => { msg.style.display = 'block'; msg.innerHTML = 'Confirm restart? <button id="yesBtn">Yes</button> <button id="noBtn" class="form__button--text">No</button>'; panel.querySelector('#yesBtn').onclick = () => { gold = 0; stats = {...DEFAULT_STATS}; saveState(); updateFields(); msg.style.display = 'none'; }; panel.querySelector('#noBtn').onclick = () => { msg.style.display = 'none'; }; };

        // Explore handler
        panel.querySelector('#exploreBtn').onclick = () => {
          
            // Ensure the message area is visible
            msg.style.display = 'block';
          
            //Check player has 100gp to explore
            if (gold < 100) {
              msg.textContent = 'Not enough gold to explore!';
              return;
            }

            //Deduct the gold price to explore
            gold -= 100;
          
            // Roll a d100 (0-99) to determine type of event
            const d100 = Math.floor(Math.random() * 100);
          
            //If d100 roll is 0-49 (50% chance), do neutral event
            if (d100 >= 0 && d100 < 50){
              //Roll a flavour dice to pick which flavour text to use
              const flavour_dice = Math.floor(Math.random() * flav_explore_neut.length);
              const flavourtext = flav_explore_neut[flavour_dice];
              //Print flavour text
              msg.textContent = `${flavourtext}`;
            }
          
            //If roll is 50-79 (30%), health loss event
            else if (d100 >= 50 && d100 < 80){
              //Roll a flavour dice to pick which flavour text to use
              const flavour_dice = Math.floor(Math.random() * flav_explore_bad.length);
              const flavourtext = flav_explore_bad[flavour_dice];
              //Deduct Health to a minimum of 0
              stats.health = Math.max(0, stats.health - 1);
              //NEED TO ADD SOMETHING HERE IF HEALTH BECOMES 0
              //Print flavour text
              msg.textContent = `${flavourtext} (-1 health)`;
            }          
            
            //If roll is 80-89 (10%), find Iron ore
            else if (d100 >= 80 && d100 < 90){
              //Roll a flavour dice to pick which flavour text to use
              const flavour_dice = Math.floor(Math.random() * flav_explore_iron.length);
              const flavourtext = flav_explore_iron[flavour_dice];
              //Increase Iron Ore by 1
              stats.ironOre++;
              //Print flavour text
              msg.textContent = `${flavourtext} (+1 Iron Ore)`;
            }     
          
            //If roll is 90-99 (10%), enemy encounter
            else if (d100 >= 90 && d100 < 100){
              //Roll a flavour dice to pick which flavour text to use
              const flavour_dice = Math.floor(Math.random() * flav_explore_monster.length);
              const flavourtext = flav_explore_monster[flavour_dice];
              //MONSTER ENCOUNTER TO GO HERE 
              //Print flavour text
              msg.textContent = `${flavourtext}`;
            }  
          
            else {
              msg.textContent = `Something went wrong`;
                }
          
            // 8. Persist state changes
            saveState();
            // 9. Update on-screen fields for gold, health, etc.
            updateFields();
        };

        // Rest at Inn handler
        panel.querySelector('#restBtn').onclick = () => {
            // Ensure message area visible
            msg.style.display = 'block';
            // Check gold cost
            if (gold < 100) {
                msg.textContent = 'Not enough gold to rest!';
                return;
            }
            else {
            // Deduct cost and restore health
            gold -= 100;
            const healthgain = stats.maxHealth - stats.health;
            stats.health = stats.maxHealth;
            //Roll for flavour text
            const flavour_dice = Math.floor(Math.random() * flav_rest.length);
            const flavourtext = flav_rest[flavour_dice];
            msg.textContent = `${flavourtext} (+${healthgain} health)`;            
            // Persist and update
            saveState();
            updateFields();
            }
        };
      
        // Add 1000 gp handler
        panel.querySelector('#addGoldBtn').onclick = () => {
            msg.style.display = 'block';
            if (currentUser === 'cyncerity') {
                gold += 1000;
                saveState();
                updateFields();
                msg.textContent = ADDGOLD_TEXT;
            } else {
                msg.textContent = 'This is a debug feature and has been disabled';
            }
        };

        //Train Strength handler
        panel.querySelector('#trainStrengthBtn').onclick = () => {
            msg.style.display = 'block';
            if (gold < 500) {
                msg.textContent = 'Not enough gold to train!';
                return;
            }
            else {
              gold -= 500;
              stats.strength++;
              //Roll a flavour dice to pick which flavour text to use
              const flavour_dice = Math.floor(Math.random() * flav_train_str.length);
              const flavourtext = flav_train_str[flavour_dice];
              msg.textContent = `${flavourtext} (+1 Strength)`;
              saveState();
              updateFields();
            }
        };

        //Train Toughness handler      
        panel.querySelector('#trainToughnessBtn').onclick = () => {
        msg.style.display = 'block';
            if (gold < 500) {
                msg.textContent = 'Not enough gold to train!';
                return;
            }
            else {
              gold -= 500;
              stats.toughness++;
              //Roll a flavour dice to pick which flavour text to use
              const flavour_dice = Math.floor(Math.random() * flav_train_tough.length);
              const flavourtext = flav_train_tough[flavour_dice];
              msg.textContent = `${flavourtext} (+1 Toughness)`;
              saveState();
              updateFields();
            }
        };

      
        panel.querySelector('#declareBtn').onclick = () => {
            if (!confirm('Are you sure you want to declare your power level to all?')) return;
            alert(`Hear ye! I stand mighty with Strength (${stats.strength}) and Toughness (${stats.toughness})!`);
        };

        // Toggle to Train Stats view
        panel.querySelector('#trainStatsBtn').onclick = () => {
            panel.querySelector('#mainActions').style.display = 'none';
            panel.querySelector('#trainActions').style.display = 'flex';
        };
        // Back to main view
        panel.querySelector('#backBtn').onclick = () => {
            panel.querySelector('#trainActions').style.display = 'none';
            panel.querySelector('#mainActions').style.display = 'flex';
        };

        function updateFields() {
            goldFld.textContent = gold;
            healthFld.textContent = stats.health;
            strengthFld.textContent = stats.strength;
            maxHealthFld.textContent = stats.maxHealth;
            toughnessFld.textContent = stats.toughness;
            ironFld.textContent = stats.ironOre;
        }
    }

    function addButton(header) {
    // Creates and inserts the ChatboxRPG toggle button into the chat header
    const btn = document.createElement('a');
    btn.className = 'form__button form__button--text';
    btn.href = 'javascript:void(0)';
    btn.textContent = 'ChatboxRPG';
    btn.onclick = showPanel;
    // Prepend a space and then the button for alignment
    header.prepend(document.createTextNode(' '));
    header.prepend(btn);
}

    function init() { loadState(); setupMessageObserver(); const hdr = document.querySelector(CHATBOX_HEADER_SELECTOR); if (!hdr) return setTimeout(init, 1000); addButton(hdr); }

    init();
})();
