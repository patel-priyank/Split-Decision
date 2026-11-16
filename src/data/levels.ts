import { DESCRIPTIONS } from './descriptions';
import { IMAGES } from './images';
import type { Energy, Kind, Level, Story } from './types';

/*
 * Split Fiction: 72 levels and 12 side stories across 8 chapters.
 *
 * Names and order: chapter select (cross-checked against GamerTweak, Sportskeeda and PowerPyx guides).
 * Images: Fextralife wiki (see images.ts).
 * Mio/Zoe = whose story it is (Mio writes sci-fi, Zoe writes fantasy).
 * Descriptions: descriptions.ts. Energy, boss flags and taglines are hand-written best guesses. Edit freely:
 *   [title, energy, tagline, boss?]
 */

type Entry = [title: string, energy: Energy, tagline: string, boss?: 'boss'];

interface ChapterDef {
  number: number;
  title: string;
  story: Story;
  levels: Entry[];
  sideStories?: Entry[];
}

const CHAPTERS: ChapterDef[] = [
  {
    number: 1,
    title: 'Rader Publishing',
    story: 'both',
    levels: [
      ['Freedom Fighters', 'chill', "A quick first step into Mio's sci-fi."],
      ['Brave Knights', 'chill', "A quick first step into Zoe's fantasy."]
    ]
  },
  {
    number: 2,
    title: 'Neon Revenge',
    story: 'mio',
    levels: [
      ['Rush Hour', 'intense', 'Flying trucks and a vehicle boss.', 'boss'],
      ['Play Me Techno', 'medium', 'Drop the beat to get through.'],
      ['Hello, Mr. Hammer', 'intense', 'Say hi to the muscle.', 'boss'],
      ['Streets of Neon', 'medium', 'Rooftops, alleys and guards.'],
      ['Parking Garage', 'intense', 'A giant robot attendant with a grudge.', 'boss'],
      ['The Getaway Car', 'intense', 'Floor it.'],
      ['Big City Life', 'chill', 'Take in the city. Some of it, anyway.'],
      ['Flipped Cityscapes', 'medium', 'Up is down, the skyline is the floor.'],
      ['Gravity Bike', 'intense', 'A chase on gravity-defying bikes.'],
      ['Skyscraper Climb', 'medium', 'Bikes, blasters and a ship.'],
      ['Head of the Crime Syndicate', 'intense', 'A tank, a tripod and a crime boss.', 'boss']
    ],
    sideStories: [
      ['The Legend of the Sandfish', 'medium', 'Desert fantasy with giant sandfish.'],
      ['Farmlife', 'chill', 'A cosy, very silly farm story.'],
      ['Mountain Hike', 'chill', 'A wholesome mountain walk. Probably.']
    ]
  },
  {
    number: 3,
    title: 'Hopes of Spring',
    story: 'zoe',
    levels: [
      ['The Underlands', 'chill', 'Down into the roots of the world.'],
      ['Lord Evergreen', 'chill', 'Meet the lord of the forest.'],
      ['Heart of the Forest', 'chill', 'A short trip inside Lord Evergreen.'],
      ['Mother Earth', 'medium', 'Nature has opinions.'],
      ['Walking Stick of Doom', 'intense', 'It is, in fact, a stick. Of doom.'],
      ['Silly Monkeys', 'chill', 'Exactly as silly as it sounds.'],
      ['It Takes Three to Tango', 'chill', 'Dance-off with the Monkey King.'],
      ['Halls of Ice', 'medium', 'Slippery floors and frozen puzzles.'],
      ['The Ice King', 'intense', 'Thaw the Ice King.', 'boss']
    ],
    sideStories: [
      ['Train Heist', 'intense', 'A sci-fi robbery on a speeding train.', 'boss'],
      ['Gameshow', 'medium', 'A game show with deadly prizes.'],
      ['Collapsing Star', 'medium', 'Space physics gone very wrong.']
    ]
  },
  {
    number: 4,
    title: 'Final Dawn',
    story: 'mio',
    levels: [
      ['The Dropship', 'intense', 'Hit the ground running.'],
      ['Infiltration', 'intense', "Sneak in. Or don't.", 'boss'],
      ['Gun Upgrade', 'medium', 'New toys.'],
      ['Toxic Tumblers', 'intense', 'Rolling cylinders, terrible footing.'],
      ['Factory Entrance', 'medium', 'Knock knock.'],
      ['Factory Exterior', 'intense', 'Climb the outside of a machine city.'],
      ['Test Chamber', 'intense', 'Take down the Factory Warden.', 'boss'],
      ['Run and Gun', 'intense', 'Exactly what it says.'],
      ['The Overseer', 'intense', 'A giant mechanical turtle boss.', 'boss'],
      ['Soaring Desperados', 'intense', 'Jetpacks on, sky full of enemies.'],
      ['The Escape', 'intense', 'Jet-skis through flooding tunnels.'],
      ['System Fail Safe Mode', 'intense', 'Tethered together. Do not drift apart.']
    ],
    sideStories: [
      ['Kites', 'chill', 'A breezy fantasy flight on kites.'],
      ['Moon Market', 'chill', 'Find three spectral cats.'],
      ['Notebook', 'chill', 'Step into the pages of a notebook.']
    ]
  },
  {
    number: 5,
    title: 'Rise of the Dragon Realm',
    story: 'zoe',
    levels: [
      ['A Serpentine Path', 'chill', 'A winding start to the dragon realm.'],
      ['Water Temple', 'medium', 'Classic temple, wet edition.'],
      ['Dragon Riders Unite', 'medium', 'Saddle up.'],
      ['The Dragon Slayer', 'intense', 'Someone wants your dragons gone.', 'boss'],
      ['Craft Temple', 'chill', 'A quick detour down the mountain.'],
      ['Dragon Souls', 'chill', 'A quieter, bonding moment.'],
      ['Treasure Temple', 'medium', 'Pink crystals and shiny loot.'],
      ['Royal Palace', 'medium', 'A dungeon crawl through the palace.'],
      ['Treasure Traitor', 'intense', 'The tortoise wants the gold more.', 'boss'],
      ['Might of Dragons', 'chill', 'First flight. Enjoy the view.'],
      ['Into the Storm', 'intense', 'Fly straight into the weather.'],
      ["Megalith's Wrath", 'intense', 'Fight a dragon on its own back.', 'boss']
    ],
    sideStories: [
      ['Slopes of War', 'medium', 'Hoverboard tricks down a warzone.'],
      ['Space Escape', 'medium', 'Escape a station before impact.'],
      ['Birthday Cake', 'medium', 'Sugar rush with a scary dentist.', 'boss']
    ]
  },
  {
    number: 6,
    title: 'Isolation',
    story: 'mio',
    levels: [
      ['Prison Ship', 'intense', 'Welcome aboard. Mind the guards.'],
      ['Handy Drones', 'medium', 'Drones that actually help.'],
      ['Down the Rabbit Hole', 'medium', 'It goes deeper than you think.'],
      ['Hydration Facility', 'medium', 'Water, pipes and plumbing puzzles.'],
      ['Prison Courtyard', 'medium', 'Turret duty: keep Zoe alive.'],
      ['Pinball Lock', 'medium', 'Mio plays pinball. Zoe is the ball.', 'boss'],
      ['Execution Arena', 'intense', 'Survive a giant robot.', 'boss'],
      ['Waste Depot', 'medium', 'Messy, smelly, dangerous.'],
      ['Cell Blocks', 'medium', 'Cell by cell.'],
      ['Maximum Security', 'intense', 'The hard part of the prison.'],
      ['The Prisoner', 'intense', 'Meet who is locked up.', 'boss']
    ]
  },
  {
    number: 7,
    title: 'The Hollow',
    story: 'zoe',
    levels: [
      ['An Ominous Welcome', 'chill', "Something's off here."],
      ['Mosaic of Memories', 'chill', 'Piece the past together.'],
      ['Ghost Town', 'medium', 'Nobody home. Or is there?'],
      ['Light in the Dark', 'medium', 'Bring a light.'],
      ['Spiritual Guides', 'chill', 'Follow the spirits.'],
      ['The Hydra', 'intense', "More heads than you'd like.", 'boss']
    ]
  },
  {
    number: 8,
    title: 'Split',
    story: 'both',
    levels: [
      ['Split Up', 'chill', 'The worlds start to come apart.'],
      ['A Warm Greeting', 'medium', 'Not as friendly as it sounds.'],
      ['Face-to-Face', 'intense', 'First round against Rader.', 'boss'],
      ['Worlds Apart', 'medium', 'Two realities, one path.'],
      ['Cross Section', 'medium', 'Slice through both worlds.'],
      ['Fight a God', 'intense', 'Exactly that.', 'boss'],
      ['A New Perspective', 'medium', 'Look at it differently.'],
      ['Outside the Box', 'intense', 'Think outside it. Run outside it.'],
      ['Final Showdown', 'intense', 'The last fight of the game.', 'boss']
    ]
  }
];

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

function buildLevels(): Level[] {
  const levels: Level[] = [];
  for (const chapter of CHAPTERS) {
    const add = (entries: Entry[], kind: Kind, story: Story, idPrefix: string) => {
      for (const [title, energy, tagline, boss] of entries) {
        levels.push({
          id: `${idPrefix}-${slug(title)}`,
          title,
          kind,
          chapterTitle: chapter.title,
          story,
          energy,
          boss: boss === 'boss',
          tagline,
          description: DESCRIPTIONS[title],
          image: IMAGES[title]
        });
      }
    };

    // Side stories belong to the *other* writer's world
    const otherStory: Story = chapter.story === 'mio' ? 'zoe' : chapter.story === 'zoe' ? 'mio' : 'both';

    add(chapter.levels, 'level', chapter.story, `ch${chapter.number}`);
    add(chapter.sideStories ?? [], 'side-story', otherStory, 'side');
  }
  return levels;
}

export const LEVELS: Level[] = buildLevels();
