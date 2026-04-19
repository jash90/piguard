import type { ConversationScenario } from './types'

export const SCENARIOS_EN: ConversationScenario[] = [
  {
    key: 'social_media',
    label: 'Social Media',
    icon: '📱',
    why: 'Endless scroll, comparison, and algorithm-driven content impact sleep, focus, and self-esteem.',
    opening:
      '"I saw you tried to open Instagram — can we talk for a minute, not to get you in trouble, just so I understand what you like about it?"',
    pitfalls: [
      'Don\'t demand phone access at random — it breaks trust fast.',
      'Don\'t moralize ("back in my day…") — they tune out within 10 seconds.',
      'Don\'t focus on screen time numbers. Focus on how the time FEELS to them.',
    ],
    ageNotes: {
      younger: 'Most platforms have a 13+ age rule for a reason. Frame as "that app is for older kids" not "you\'re too immature".',
      tween: 'This is when social comparison hits hardest. Ask what posts make them feel good vs. drained.',
      teen: 'Acknowledge it\'s how their friend group communicates. Negotiate boundaries instead of banning.',
    },
    reactions: [
      {
        label: '"Everyone else has it"',
        example: 'They insist all their classmates use the app and they\'ll be left out.',
        parentResponse:
          '"I believe you that it feels that way. Let\'s talk to two friends\' parents together to see what they actually allow — then we decide."',
        avoid: 'Calling them a liar or saying "I don\'t care what everyone else does".',
      },
      {
        label: 'Silence / shrug',
        example: 'They go quiet or give one-word answers.',
        parentResponse:
          '"That\'s fine, we don\'t have to solve it now. Think about it and tell me tomorrow what would feel fair to you."',
        avoid: 'Filling the silence with your own monologue.',
      },
      {
        label: 'Anger / slammed door',
        example: '"You\'re controlling me! You don\'t trust me!"',
        parentResponse:
          '"I hear that you\'re upset. I\'m not trying to control you — I want to keep you safe. Let\'s pause and come back when we\'re both calmer."',
        avoid: 'Matching their volume. Escalation ends the conversation.',
      },
      {
        label: 'Tears / shame',
        example: 'They cry or hide their face.',
        parentResponse:
          '"You\'re not in trouble. I\'m on your side. Take a breath — we\'ll figure this out together."',
        avoid: 'Rushing to "fix" the feeling with logic.',
      },
      {
        label: 'Negotiation',
        example: '"What if I only use it for an hour, only on weekends?"',
        parentResponse:
          '"That\'s a reasonable start. Let\'s try it for two weeks, then we both check in — you tell me how it felt and we adjust."',
        avoid: 'Agreeing then silently tightening the rules later.',
      },
    ],
    redFlags: [
      'Losing sleep to scroll past midnight more than 3 nights a week.',
      'Mood crashes within minutes of closing the app.',
      'Secrecy with specific accounts (hidden, "finstas", locked messages from strangers).',
    ],
    followUp: [
      'Write down the agreed rule together on paper — not just verbal.',
      'Schedule a 2-week check-in on the calendar, visible to both.',
      'Install one shared app (e.g. a game) you can both play — rebuilds trust.',
    ],
  },
  {
    key: 'adult_content',
    label: 'Adult Content',
    icon: '🔞',
    why: 'Early exposure shapes ideas about consent, bodies, and relationships — often in harmful ways.',
    opening:
      '"I want to talk about something that might feel awkward — it\'s okay to be embarrassed, I\'ll be too. What\'s important is that you know you\'re not in trouble."',
    pitfalls: [
      'Don\'t ask "did you watch it?" — yes/no interrogations shut them down.',
      'Don\'t pretend it doesn\'t exist. They know it does.',
      'Don\'t weaponize shame. Shame drives the behavior underground.',
    ],
    ageNotes: {
      younger: 'Explain: "Some websites show grown-up things that aren\'t meant for you — tell me if it pops up, you won\'t be in trouble."',
      tween: 'Curiosity is normal. Separate "curious about bodies" (normal) from "watching porn" (distorts what real intimacy is).',
      teen: 'Talk about porn vs. real relationships: consent, stopping, communication — none of that shows in most porn.',
    },
    reactions: [
      {
        label: 'Deflection / joking',
        example: 'They laugh it off or make it a joke.',
        parentResponse:
          '"I know this is awkward. I\'ll be brief — I just want you to know you can ask me anything without being judged."',
        avoid: 'Getting annoyed that they\'re not "being serious".',
      },
      {
        label: 'Embarrassed silence',
        example: 'Bright red face, looks at the floor.',
        parentResponse:
          '"You don\'t have to say anything. Just listen. If you ever have a question, I promise I won\'t make it weird."',
        avoid: 'Forcing eye contact.',
      },
      {
        label: 'Defensive anger',
        example: '"That\'s disgusting, I would never!"',
        parentResponse:
          '"Okay. I\'m not accusing you — I\'m telling you that if it ever happens, you won\'t lose my trust by telling me."',
        avoid: 'Arguing about whether they did or didn\'t.',
      },
      {
        label: 'Honest admission',
        example: '"Yeah, a friend showed me something."',
        parentResponse:
          '"Thanks for telling me. How did it make you feel? That feeling matters more than the content."',
        avoid: 'Punishing the honesty — you\'ll never hear the truth again.',
      },
      {
        label: 'Questions',
        example: '"Why do people watch that?"',
        parentResponse:
          '"Good question. Curiosity is normal. The problem is most of it shows a fake version of intimacy — no respect, no consent. Let\'s talk about what real relationships look like."',
        avoid: 'Dodging the question.',
      },
    ],
    redFlags: [
      'Compulsive use (hours per day, affecting school/sleep).',
      'Describing violent or non-consensual scenarios as "normal".',
      'Any mention of an adult initiating sexual conversation online — call authorities immediately.',
    ],
    followUp: [
      'Put devices in shared spaces (not bedrooms) for a while, framed as "for all of us".',
      'Book a session with a family therapist if the topic keeps coming up — they\'re trained for this.',
      'Leave the door open: "You can come back to this conversation anytime."',
    ],
  },
  {
    key: 'gambling',
    label: 'Gambling',
    icon: '🎰',
    why: 'Gambling sites (and loot boxes in games) exploit the same dopamine circuits as cocaine — the teenage brain is extra vulnerable.',
    opening:
      '"I saw a betting site got blocked. I\'m not mad — I want to understand. Was it something a friend sent you, or were you just curious?"',
    pitfalls: [
      'Don\'t confuse "skill" with "gambling" — poker with friends is different from online casino.',
      'Don\'t ignore loot boxes. They train the same pattern.',
      'Don\'t moralize about money. Focus on how gambling is engineered to feel good even when you lose.',
    ],
    ageNotes: {
      younger: 'Frame as: "These are designed to trick adults into losing money — your brain would have no chance."',
      tween: 'Explain house edge: "The site always wins long-term. It\'s math, not luck."',
      teen: 'Talk about crypto/sports betting hype on TikTok — influencers get paid to lose publicly.',
    },
    reactions: [
      {
        label: '"I was just looking"',
        example: 'They insist they never placed a bet.',
        parentResponse:
          '"Okay. I believe curiosity is the most common reason. Let me show you how these sites are designed — it\'s kind of interesting."',
        avoid: 'Accusations without evidence.',
      },
      {
        label: '"It\'s my money"',
        example: 'They argue about allowance or earned money.',
        parentResponse:
          '"You\'re right, it\'s yours. My job is to make sure you don\'t lose it to a site that\'s legally off-limits until you\'re 18."',
        avoid: 'Taking the money away as punishment.',
      },
      {
        label: 'Bragging about winning',
        example: '"I turned €5 into €40!"',
        parentResponse:
          '"Cool win. Now let\'s track every session for a week — wins and losses — on paper. You\'ll see what the real number is."',
        avoid: 'Mocking or dismissing the win. They\'ll hide the losses.',
      },
      {
        label: 'Hiding losses',
        example: 'You find they\'ve lost significant money.',
        parentResponse:
          '"I\'m proud you didn\'t lie when I asked. Losing money is scary — let\'s figure out a plan, not a punishment."',
        avoid: 'Bailing them out without a conversation about the habit.',
      },
      {
        label: 'Denial after obvious use',
        example: 'Browser history + blocked attempts exist, they deny.',
        parentResponse:
          '"I\'m going to show you what I saw, not to corner you, but because I\'d rather talk than pretend."',
        avoid: 'Leading them into a lie before revealing you know.',
      },
    ],
    redFlags: [
      'Borrowing money from friends or siblings repeatedly.',
      'Selling possessions (games, skins) to fund accounts.',
      'Secrecy about payment methods / using parents\' cards without asking.',
    ],
    followUp: [
      'Install Gamban or similar blocker (not just DNS-level).',
      'Help them set a "cooling-off" period (30 days) and reward milestones.',
      'Share GamCare (UK), Anonimowi Hazardziści (PL), or local teen-focused support.',
    ],
  },
  {
    key: 'drugs',
    label: 'Drugs',
    icon: '💊',
    why: 'Kids encounter drug content (normalization, sales, "research chemicals") long before offline exposure. Conversations must come first.',
    opening:
      '"I saw a site got blocked that was about drugs. I\'d rather talk to you than assume — what were you trying to find out?"',
    pitfalls: [
      'Don\'t use scare tactics from the 90s — kids have Google, they\'ll fact-check you.',
      'Don\'t conflate weed, MDMA, and heroin — credibility dies if you do.',
      'Don\'t punish curiosity. Punish dishonesty.',
    ],
    ageNotes: {
      younger: 'Focus on medicines: "Only take what we or a doctor gives you. Never try something a friend offers."',
      tween: 'Talk about vaping and energy drinks as gateway habits (real, not moral panic).',
      teen: 'Be honest about risk differences. "Weed isn\'t heroin. But a developing brain reacts differently to everything."',
    },
    reactions: [
      {
        label: '"I was just curious"',
        example: 'They claim research, not use.',
        parentResponse:
          '"Fair. What did you want to know? Let\'s look it up on Erowid or a harm-reduction site together — not a dealer\'s page."',
        avoid: 'Assuming "curious" = "using".',
      },
      {
        label: '"A friend does it"',
        example: 'They deflect to someone else.',
        parentResponse:
          '"Thanks for telling me. I\'m not going to rat them out. I want to know: are you worried about them?"',
        avoid: 'Banning the friend without a conversation.',
      },
      {
        label: 'Admitting use',
        example: '"I tried weed once."',
        parentResponse:
          '"I appreciate you telling me. That took courage. How was it? What would you want to do differently?"',
        avoid: 'Immediate punishment — the next honest conversation won\'t happen.',
      },
      {
        label: 'Anger / walkout',
        example: '"You\'re accusing me of being a junkie!"',
        parentResponse:
          '"I\'m not. Go cool off. When you come back I\'d like to hear what made that feel like an accusation."',
        avoid: 'Following them yelling.',
      },
      {
        label: 'Joking / minimizing',
        example: '"Dad, everyone drinks, chill."',
        parentResponse:
          '"Drinking isn\'t the same as trying research chemicals you bought online. Those are cooked in labs with no quality control."',
        avoid: 'Matching the joke and dropping the subject.',
      },
    ],
    redFlags: [
      'Unexplained cash or missing money.',
      'New friend group + secrecy + mood swings combined.',
      'Paraphernalia found in room or car.',
      'Any mention of opioids, benzos, or unknown pills — immediate doctor visit.',
    ],
    followUp: [
      'Keep medicines locked. Count pills if needed.',
      'Know the signs of overdose for the region\'s common substances — have Narcan/naloxone if relevant.',
      'Refer to adolescent-specialist counselor, not a general therapist.',
    ],
  },
  {
    key: 'self_harm',
    label: 'Self-harm / Pro-ana',
    icon: '⚠️',
    why: 'Pro-ana and self-harm communities actively teach kids to hide symptoms and compete on severity. Attempted access is urgent.',
    opening:
      '"I love you. I\'m not here to punish you — I\'m here because I\'m worried. Can you tell me how you\'ve been feeling lately?"',
    pitfalls: [
      'Don\'t ask "are you cutting yourself?" as a yes/no — invites a lie.',
      'Don\'t promise secrecy you can\'t keep. Say: "I will always tell your other parent / doctor if it\'s serious. Always."',
      'Don\'t leave them alone after a tense disclosure for at least a few hours.',
    ],
    ageNotes: {
      younger: 'Keep language simple: "Some websites teach kids to hurt themselves. That\'s never a way to feel better — let\'s figure out what is."',
      tween: 'Body-image attacks peak here. Talk about filters and how NOBODY looks like Instagram photos.',
      teen: 'Be direct: "If you\'re thinking about hurting yourself or not eating, I\'d rather hear it from you than find out later."',
    },
    reactions: [
      {
        label: 'Denial',
        example: '"I\'m fine. Stop making a big deal."',
        parentResponse:
          '"Okay. I hear you. I\'m still going to sit with you for a bit. You don\'t have to talk."',
        avoid: 'Walking away "to give space" when you\'re actually scared.',
      },
      {
        label: 'Crying / breakdown',
        example: 'They cry hard or shake.',
        parentResponse:
          '"I\'m here. You don\'t need to explain yet. Let\'s breathe together. We\'ll call someone who can help when you\'re ready."',
        avoid: 'Problem-solving mid-tears.',
      },
      {
        label: 'Admission + "don\'t tell anyone"',
        example: '"I do it but please don\'t tell Dad."',
        parentResponse:
          '"I won\'t share details. But this is bigger than just us. A doctor needs to help — they\'ve seen this a thousand times."',
        avoid: 'Promising total secrecy.',
      },
      {
        label: 'Cold / flat affect',
        example: 'No emotion, short answers, detached.',
        parentResponse:
          '"I\'m going to make an appointment for us this week. You don\'t have to talk to me, but you need to talk to someone."',
        avoid: 'Mistaking flatness for "being okay".',
      },
      {
        label: 'Suicidal hints',
        example: '"It would be easier if I wasn\'t here."',
        parentResponse:
          '"Thank you for trusting me with that. I love you. Right now we\'re going together to call the crisis line / go to ER." STAY WITH THEM.',
        avoid: 'Treating it as a "teen phase" — treat every mention as real.',
      },
    ],
    redFlags: [
      'Long sleeves or bandaging in hot weather.',
      'Rapid weight change in either direction.',
      'Giving away prized possessions.',
      'Searches for "painless methods" or specific mention of ending their life.',
      'Ritualized food tracking or hiding food.',
    ],
    followUp: [
      'Remove means at home (razors, medication stockpiles, firearms locked).',
      'Same-week appointment with a clinician experienced in adolescents.',
      'Local crisis line saved in their phone AND yours.',
      'Parent self-care: get your own therapist. This is heavy to carry alone.',
    ],
  },
  {
    key: 'violence_gore',
    label: 'Violence & Gore',
    icon: '🩸',
    why: 'Repeated exposure to graphic real violence desensitizes kids and is linked to intrusive thoughts, anxiety, and sleep issues.',
    opening:
      '"You tried to open a site with pretty graphic stuff. I\'m not angry. Sometimes people watch that out of curiosity. How did it make you feel if you saw it?"',
    pitfalls: [
      'Don\'t confuse fictional violence (games, horror) with real-world gore sites — different effects.',
      'Don\'t overreact to one-time curiosity. Do react to patterns.',
    ],
    ageNotes: {
      younger: 'Focus on "real vs. pretend". Young brains don\'t reliably separate them.',
      tween: 'This is a peak age for "shock video" trading between friends. Ask who sent it.',
      teen: 'Discuss desensitization honestly. "The 10th time is not the same as the 1st — your brain stops reacting."',
    },
    reactions: [
      {
        label: '"It was just a meme"',
        example: 'They frame it as a joke / edgy humor.',
        parentResponse:
          '"Meme culture pushes this stuff hard. That doesn\'t make it harmless. How did it actually feel watching it?"',
        avoid: 'Dismissing the humor aspect as fake — it\'s real to them.',
      },
      {
        label: 'Bravado',
        example: '"It was cool, didn\'t bother me."',
        parentResponse:
          '"Maybe not now. Sometimes that kind of stuff shows up at 3 a.m. later. If that happens, come find me."',
        avoid: 'Lecturing about "you THINK you\'re tough".',
      },
      {
        label: 'Upset / disturbed',
        example: 'They admit it was horrible and they can\'t stop thinking about it.',
        parentResponse:
          '"That makes sense. Images like that stick. Let\'s talk about what helps — sometimes it fades, sometimes a therapist is useful."',
        avoid: 'Minimizing ("it\'s just a video").',
      },
      {
        label: 'Dodging the topic',
        example: 'Topic switches every time you try.',
        parentResponse:
          'Circle back once a day for a week in 60-second doses. "Just want to check — brain okay today?"',
        avoid: 'Giving up after one deflection.',
      },
      {
        label: 'Sharing / peer pressure',
        example: 'Friends send gore videos in group chats.',
        parentResponse:
          '"You can mute or leave that chat. You don\'t owe them your reactions. Want help writing what to say?"',
        avoid: 'Confiscating the phone to "solve" it.',
      },
    ],
    redFlags: [
      'Seeking out more extreme content over time.',
      'Fascination with specific perpetrators or mass-violence events.',
      'Threats of violence to self or others — immediate professional help.',
      'Sleep disruption or nightmares lasting >2 weeks.',
    ],
    followUp: [
      'Introduce a "news diet" — follow one credible source, drop gore/shock feeds.',
      'Screen for anxiety/PTSD symptoms with a clinician if disturbance lingers.',
      'Discuss how to block/report accounts in the apps they use.',
    ],
  },
  {
    key: 'dating',
    label: 'Dating Apps',
    icon: '💔',
    why: 'Dating apps weren\'t built for minors. Predators, sextortion, and bodyshock content all hit hard.',
    opening:
      '"A dating app was blocked on your device. I\'m curious — was it you, or did something auto-install? I just want to understand, not interrogate."',
    pitfalls: [
      'Don\'t assume it\'s sexual. It might be loneliness or wanting attention.',
      'Don\'t make it about gender/orientation unless they bring it up — that conversation is separate.',
    ],
    ageNotes: {
      younger: 'Dating apps are explicitly for adults. Frame as a safety rule, not a shame rule.',
      tween: 'Talk about catfishing and sextortion — these happen weekly in every country.',
      teen: 'Discuss age-verification gaps. "These apps lie about being 18+. Adults target young accounts specifically."',
    },
    reactions: [
      {
        label: 'Embarrassment',
        example: 'Red-faced, wants the conversation over.',
        parentResponse:
          '"Okay. One sentence then I\'ll drop it: adults on those apps target younger accounts on purpose. That\'s the only reason I care."',
        avoid: 'Dragging out the awkward.',
      },
      {
        label: '"I\'m just talking to friends"',
        example: 'They claim it\'s for socializing, not dating.',
        parentResponse:
          '"I get it. Apps like Discord or Snap work for that without the adults-looking-for-teens problem."',
        avoid: 'Accusing them of lying without listening.',
      },
      {
        label: 'Revealing grooming attempt',
        example: '"This older person asked me to send pictures."',
        parentResponse:
          '"Thank you for telling me. You did nothing wrong. We\'re going to screenshot everything and report together — police/NCMEC/Dyżurnet (PL)."',
        avoid: 'Panicking OUT LOUD — internal panic is fine.',
      },
      {
        label: 'Denial + device wipe',
        example: 'You later find the app was reinstalled + history cleared.',
        parentResponse:
          '"I saw it again. I\'d rather hear why than pretend. Let\'s figure out what need this is trying to fill."',
        avoid: 'One-off lecture without addressing the underlying loneliness.',
      },
    ],
    redFlags: [
      'Secrecy around one specific contact.',
      'New expensive gifts you didn\'t buy.',
      'Night-time texting with an unknown adult.',
      'Pressure to meet someone in person "just them".',
      'Any nude request or sent image — stop the conversation, document, report.',
    ],
    followUp: [
      'Enable MDM-level app restrictions, not just DNS.',
      'Teach: screenshot + block + tell a trusted adult = always safe response to weird messages.',
      'Know where to report: NCMEC (US), CEOP (UK), Dyżurnet (PL), local police child-protection unit.',
    ],
  },

  {
    key: 'weapons',
    label: 'Weapons',
    icon: '🔫',
    why: 'Curiosity about weapons is common in teens. The problem starts when "watching shooting videos" becomes "searching how to get one" or "how to build one".',
    opening:
      '"A page about weapons was blocked. I\'m not assuming the worst — I want to know what caught your attention. A film, a game, something a friend said?"',
    pitfalls: [
      'Visiting these pages doesn\'t make a teenager a future attacker. Fascination with weapons is sometimes a normal phase.',
      'Don\'t mock — shame pushes the fascination underground.',
      'Don\'t bribe with "we\'ll buy you a shooting range membership" to distract. Talk directly.',
    ],
    ageNotes: {
      younger: 'Many cartoons and games show weapons as toys. Explain: "In real life, guns kill. We don\'t touch them, even if they look like toys."',
      tween: 'This is the age of first "how to disassemble a pistol" videos on YouTube. Ask if the idea came from friends — peer pressure is key.',
      teen: 'Be honest: "Firearms in most countries require permits and psychological screening. Even airguns have age limits. Want to learn to shoot legally? Let\'s look at a range with an instructor."',
    },
    reactions: [
      {
        label: '"It\'s just a video / game"',
        example: 'They downplay — "I watched a pistol review in a game".',
        parentResponse:
          '"Okay, I believe you. Show me exactly what — we\'ll watch together, see if it\'s a gaming channel or something else."',
        avoid: 'Rejecting their explanation without looking at the actual content.',
      },
      {
        label: 'Fascination with perpetrators',
        example: 'They ask about school shootings, know attackers\' names.',
        parentResponse:
          '"That worries me — not because I think you\'d do it. Because I want to understand what pulls you toward it. Let\'s talk."',
        avoid: 'Silence or avoiding the topic. Fascination with perpetrators is a signal requiring conversation.',
      },
      {
        label: '"I want to learn to shoot"',
        example: 'They directly say shooting sports interest them.',
        parentResponse:
          '"That\'s a fair request. Let\'s find a shooting club that accepts minors with a parent. Better that than self-taught from the internet."',
        avoid: 'Automatic "no" without consideration — you\'ll push them to watch covertly.',
      },
      {
        label: 'Building weapons',
        example: 'They search "how to make a gun at home" or "ghost gun".',
        parentResponse:
          '"Stop. This is felony-level stuff, not internet trivia. Sit down, we talk — what\'s making you search for this?"',
        avoid: 'Dismissing with "they won\'t actually do it". Treat it seriously.',
      },
      {
        label: 'Threats / joke-threats',
        example: '"If I had a gun I\'d wipe out half the class."',
        parentResponse:
          '"I have to take what you said seriously. Even if you were joking. I love you — that\'s why we\'re going to talk to someone who can help us, right now."',
        avoid: 'Laughing it off, looking the other way. Treat every such statement as real.',
      },
    ],
    redFlags: [
      'Fascination with specific attacks, perpetrators, manifestos.',
      'Searching "how to get a gun" or "how to build one".',
      'Lists of people who "deserve it".',
      'Combination: social isolation + anger + weapons interest = immediate professional help.',
    ],
    followUp: [
      'At home: secure every weapon (including airguns, bows, collector knives).',
      'Book a psychologist visit — not as punishment, as "I want you to have someone to talk to about hard stuff".',
      'Consider legal, supervised shooting sport if the interest is healthy.',
      'Emergencies: 112 / 911 or local crisis hotline.',
    ],
  },

  {
    key: 'cyberbullying_risk',
    label: 'Cyberbullying risk',
    icon: '🗯️',
    why: 'Anonymous Q&A apps (NGL, Tellonym, Ask.fm) are designed so people write what they\'d never say to your face. Teens read it personally — sometimes tragically.',
    opening:
      '"I saw you used an app where people write anonymously. Not to take it away — to know if anyone is hurting you there."',
    pitfalls: [
      'Don\'t say "just turn it off". For a teen, that is their social world.',
      'Don\'t read their messages without their knowledge — you lose trust.',
      'Don\'t downplay — words online hurt as much as in the classroom, sometimes more because they\'re permanent.',
    ],
    ageNotes: {
      younger: 'Simple: "There are apps where people can write mean things and you don\'t know who wrote them. If anyone hurts you there, tell me right away."',
      tween: 'The hardest age. Ask directly: "Has anyone ever written something that made you not want to go to school?"',
      teen: 'Talk about how anonymous asks are often their own friend group, not strangers. Betrayal hurts more.',
    },
    reactions: [
      {
        label: 'Dismissal',
        example: '"Nobody takes that stuff seriously."',
        parentResponse:
          '"Maybe. Still, it\'s designed for you to read. Remember, I\'m not checking your chats — can you tell me honestly how it actually lands with you?"',
        avoid: 'Insisting it hurts when they say it doesn\'t. Trust they can come back to this.',
      },
      {
        label: 'Admits bullying',
        example: '"One anon has been saying I\'m ugly for two weeks."',
        parentResponse:
          '"Thank you for telling me. Let\'s save screenshots. Not to go after them now — to have proof if it escalates. Who do you suspect?"',
        avoid: 'Immediate "I\'m going to the school" without their consent — they\'ll feel betrayed.',
      },
      {
        label: 'Self-blame',
        example: '"Maybe they were right, something is wrong with me."',
        parentResponse:
          '"Stop. This is a deliberate trick — they wrote something you\'re starting to believe. It\'s not the truth about you. I\'ll show you others who\'ve been through this and why it\'s not your fault."',
        avoid: 'Dismissive "don\'t be silly" — that confirms to them the attack landed.',
      },
      {
        label: 'Revenge anger',
        example: '"I\'ll find them and destroy them."',
        parentResponse:
          '"I get it. It makes me angry too. But revenge spirals. Better plan: I\'ll show you how to report and block, and we\'ll think together about whether this is a school issue."',
        avoid: 'Encouraging revenge plans. The child is losing control; you keep it.',
      },
      {
        label: 'Withdrawal / silence',
        example: 'Not eating, skipping school, won\'t make eye contact.',
        parentResponse:
          '"I can see something\'s off. I don\'t need to know today. But tomorrow we sit down. Meanwhile, phone stays next to you — promise you\'ll wake me if it gets hard."',
        avoid: 'Leaving the child alone with their silence for days.',
      },
    ],
    redFlags: [
      'Sudden change in relationship with a specific friend group.',
      'Avoiding school, stomach/headaches before leaving home.',
      'Deleting all photos from social media.',
      'Mentions of "not worth living" or "everyone hates me" — take seriously.',
    ],
    followUp: [
      'Report and block the account/message in the app, together.',
      'If it\'s school peers — decide to speak to the teacher together with your child, not behind their back.',
      'Save a child helpline number (US: 988; UK: Childline 0800 1111; PL: 116 111) in their contacts.',
      'Consider therapy — cyberbullying leaves marks similar to workplace mobbing.',
    ],
  },

  {
    key: 'proxy_vpn',
    label: 'VPN & proxy',
    icon: '🕵️',
    why: 'Trying to bypass filters is a signal, not a crime. Your kid is learning to think independently — the problem is a VPN also unlocks everything you were protecting them from.',
    opening:
      '"I see you tried installing a VPN. I\'m not angry — I\'m curious what you wanted to watch or access. My guess: something I blocked?"',
    pitfalls: [
      'Don\'t pretend VPN is a hacker tool. You use it at work — be honest.',
      'Don\'t escalate punishments — they\'ll install a better VPN next time.',
      'Don\'t ignore it — one working VPN means the whole DNS block is bypassed.',
    ],
    ageNotes: {
      younger: 'Too young for technical depth. Enough: "This app gets around what we agreed at home about what we watch. Please don\'t install it without telling me."',
      tween: 'Explain: "VPN is like switching TV channels through another country. Legal, but in our home we use the rules we agreed on together."',
      teen: 'Talk as equals: "I know you know how it works. Instead of an arms race — tell me what you want unblocked, and we decide together."',
    },
    reactions: [
      {
        label: '"For privacy"',
        example: 'They cite "right to privacy online".',
        parentResponse:
          '"Privacy matters, agreed. But this is about bypassing rules we set together. Two different things. Let\'s start with what you actually want to see."',
        avoid: 'Lecturing "you don\'t have privacy yet". They do — but not freedom to break agreements.',
      },
      {
        label: '"Everyone has a VPN"',
        example: 'They cite classmates.',
        parentResponse:
          '"Possibly. Still, we agreed differently at home. Want to convince me to change the rule? Give me concrete reasons — I\'m listening."',
        avoid: 'Going into "show me which ones".',
      },
      {
        label: 'Admits specific need',
        example: '"I wanted to watch a show not available here."',
        parentResponse:
          '"Thanks for honesty. Let\'s check if the show is legally available elsewhere, or agree on conditions under which I can say yes."',
        avoid: 'Refusal without conversation — you lose a chance at compromise.',
      },
      {
        label: 'Anger about control',
        example: '"You don\'t trust me, you\'re spying on me!"',
        parentResponse:
          '"I do trust you. My job isn\'t to trust blindly — it\'s to help you learn boundaries, so in a few years you set them yourself. Let\'s talk about how much oversight is okay for you."',
        avoid: 'Defensive "because I\'m the parent".',
      },
      {
        label: 'Covert install',
        example: 'You find a VPN reinstalled after earlier conversations.',
        parentResponse:
          '"I see you installed it again. This isn\'t about VPN anymore — it\'s about you lying. That hurts more than the app."',
        avoid: 'Punishment for VPN without addressing the broken agreement.',
      },
    ],
    redFlags: [
      'VPN used together with one specific messaging app — may indicate a hidden conversation.',
      'Regular browser history wiping.',
      'Managing several email / Apple ID / Google accounts you didn\'t know about.',
    ],
    followUp: [
      'Enable Screen Time (iOS) or Family Link (Android) — block installing apps without approval.',
      'Talk about one specific thing to unblock — negotiation instead of an arms race.',
      'Check together why a given site was blocked — maybe unnecessarily.',
    ],
  },

  {
    key: 'dark_web',
    label: 'Dark web & Tor',
    icon: '🕳️',
    why: 'In 99% of cases, dark-web interest is pop culture and curiosity. The other 1% is real risk — substances to buy, content you can\'t unsee.',
    opening:
      '"I saw you tried to open Tor. Not making a scene — let\'s talk. What\'s the pull?"',
    pitfalls: [
      'Don\'t turn it into a thriller — you\'ll give them the excitement of secrecy they crave.',
      'Don\'t dismiss — "just curiosity" is sometimes a starting point.',
      'Don\'t block without talking — the next step is learning how to bypass the block.',
    ],
    ageNotes: {
      younger: 'Skip the technical detail. Enough: "There are places online where people sell dangerous things, like drugs. Not for you."',
      tween: 'Explain calmly: "Tor is a browser that hides who uses it. Not evil on its own — but 80% of what\'s there is criminal markets."',
      teen: 'Respect their intelligence: "If online privacy truly interests you, there are safer paths. Let\'s watch a documentary together — then you decide."',
    },
    reactions: [
      {
        label: 'Cybersecurity interest',
        example: '"I\'m learning hacking / ethical hacking."',
        parentResponse:
          '"Great topic. I know legal paths — CTFs, HackerOne courses, TryHackMe. Deal: no Tor, but a real course. Okay?"',
        avoid: 'Dismissing the passion — cybersecurity is a great career.',
      },
      {
        label: 'Curiosity after a show',
        example: '"I watched a series, wanted to see what it looks like."',
        parentResponse:
          '"Fine. I\'ll show you a documentary where a journalist describes what they found — without going live. Saves you images that stay for years."',
        avoid: 'Making it scarier ("you can\'t handle it"). A dare activates the teen brain.',
      },
      {
        label: 'Purchases',
        example: 'Clear signals they\'re looking for substances or illegal goods.',
        parentResponse:
          '"Stop. This is a line we don\'t cross. You need to know: if you buy something and it comes out, you\'ll have a criminal case before 18. We talk now."',
        avoid: 'Accusations without data. If you suspect — ask directly, don\'t guess.',
      },
      {
        label: 'Showing friends',
        example: 'Uses Tor as a "cool trick" to impress friends.',
        parentResponse:
          '"I get it — it looks cool. Problem: if any of you clicks a bad link, someone can see your address or show content you shouldn\'t see. Let\'s find a better way to impress."',
        avoid: 'Predicting the worst ("you\'ll be arrested"). Use concrete consequence instead.',
      },
      {
        label: 'Denial',
        example: '"Wasn\'t me, must have been an update."',
        parentResponse:
          '"I\'m showing you exactly what I saw and when. Not accusing — asking for a conversation. Better to know than to fill in the blanks."',
        avoid: 'Accepting "not me" without a real conversation. If it truly wasn\'t them — it\'ll come back.',
      },
    ],
    redFlags: [
      'Buying a crypto wallet alongside Tor use.',
      'Specific queries like "how to buy [substance]" or "how to get [item]".',
      'Isolation after a Tor session — may mean they saw something traumatic.',
      'Fascination with manifestos, "how-to" documents for dangerous things.',
    ],
    followUp: [
      'Block installing new browsers (iOS Restrictions; Android Family Link).',
      'Offer a legal privacy alternative: Brave, ProtonMail, Signal — if privacy is their goal.',
      'Come back to the topic once a month for a quarter — it doesn\'t go away after one talk.',
      'If they saw graphic content — a psychologist visit; dark-web imagery leaves a mark.',
    ],
  },

  {
    key: 'piracy',
    label: 'Piracy',
    icon: '🏴‍☠️',
    why: 'A show, a game, a textbook — "free from the internet" is a natural reflex. The problem: pirate sites are 90% malware, fake invoices, and data theft.',
    opening:
      '"A free-movie site got blocked. I\'m not going to pretend no one does this. But let\'s talk about why it\'s not a great idea."',
    pitfalls: [
      'Don\'t moralize "you\'re stealing from artists". They\'ll point at Netflix\'s billions — and they\'re partly right.',
      'Don\'t pretend you\'ve never downloaded anything. Be honest about your own habits.',
      'Don\'t lead with the legal argument — start with device safety.',
    ],
    ageNotes: {
      younger: 'Short rule: "Don\'t click on \'free\' without asking. Those links often carry viruses."',
      tween: 'Concrete: "Pirate sites make money from ads that install malware. Not paranoia — it\'s a business model."',
      teen: 'Respectful: "I know Spotify or Netflix can feel expensive. Let\'s sit down — see what you actually watch, and decide what\'s worth paying for."',
    },
    reactions: [
      {
        label: 'Pragmatism',
        example: '"I can\'t afford all these subscriptions."',
        parentResponse:
          '"Fair. I\'ll show you the library — films, books, games, often free. And pick one subscription — it comes out of your allowance."',
        avoid: 'Dumping responsibility on the child ("no money — your problem").',
      },
      {
        label: '"Everyone does it"',
        example: 'Lots of classmate arguments.',
        parentResponse:
          '"Some probably do. I still don\'t want malware on our router. Let\'s pick one legal source and stick to it."',
        avoid: 'Discrediting their friends ("their parents don\'t care").',
      },
      {
        label: 'School textbooks',
        example: 'They pirate PDFs because "there\'s no other way".',
        parentResponse:
          '"Common problem. Let\'s check the school\'s digital library, Open Library, Internet Archive. I\'ll show you how."',
        avoid: 'Pretending textbooks are cheap. They aren\'t — kids see this more clearly than we do.',
      },
      {
        label: 'Malware',
        example: 'Computer slowing down, pop-up ads, "my TikTok password changed".',
        parentResponse:
          '"You have malware. Don\'t click any \'fixers from the internet\'. We sit together — reboot, scan, change passwords. You\'re not the first."',
        avoid: 'Punishing for catching a virus. Better to go through the repair together.',
      },
      {
        label: 'Shame',
        example: 'They avoid the topic because "they know it\'s illegal".',
        parentResponse:
          '"You\'re not a criminal. You\'re a teenager who wanted to watch a show. Thanks for honesty. Two things: check what got infected, and find a way to watch safely."',
        avoid: 'Using shame as leverage. Only deepens hiding.',
      },
    ],
    redFlags: [
      'Computer sending huge amounts of data at night (possible bot in your home network).',
      'Parents\' card showing small, strange charges — card may be stolen.',
      'Child starts "cheap" selling of games/accounts in groups — may be trafficking stolen goods.',
    ],
    followUp: [
      'Pick one legal subscription within budget together.',
      'Install a free antivirus scanner and run a full scan.',
      'Change passwords on important accounts — bank, email, Apple/Google IDs.',
      'Suggest: public libraries, free-classics projects, legal YouTube channels.',
    ],
  },

  {
    key: 'crypto_risky',
    label: 'High-risk crypto',
    icon: '📉',
    why: '"Buy this token, become a millionaire" videos are designed like ADHD in a bottle: short, hype, amplified by the algorithm. Teens lose savings faster than adults lose at gambling.',
    opening:
      '"I see you checked crypto sites. I\'m not forbidding it — I want to understand. Want to invest, earn, or just curious?"',
    pitfalls: [
      'Don\'t pretend crypto doesn\'t exist. A classmate already "made money" and talks about it daily.',
      'Don\'t lump everything together as a scam — there are legal exchanges, and there are meme tokens from TikTok ads. Not the same.',
      'Don\'t say "if you lose, your problem". Losing the first €100 at 14 builds a financial trauma that lasts years.',
    ],
    ageNotes: {
      younger: 'Unlikely for kids under 10 to watch crypto content. If so: "It\'s like playing with Monopoly money — except this money is real."',
      tween: 'Show a real memecoin chart — pump and -95%. "This is what influencers present as a success."',
      teen: 'Adult-to-adult: "Investing isn\'t gambling if you know the math. Let me show you compound interest, ETFs, and why pump.fun is a different league."',
    },
    reactions: [
      {
        label: '"A friend made money"',
        example: 'Story about a classmate who "did a 10x".',
        parentResponse:
          '"Maybe. Ask them how much they lost before, and how much they\'ll lose right after. People share wins, not balances."',
        avoid: 'Calling the friend a liar. They likely believe their own story.',
      },
      {
        label: 'Wants to start investing',
        example: '"I have €100 saved, I want to buy Solana."',
        parentResponse:
          '"Okay, let\'s talk. 10% of that — we buy together, log it in a spreadsheet, watch for a year. The other 90% goes to a savings account — that\'s your safe base."',
        avoid: 'A flat "no". Better to teach in a controlled setting.',
      },
      {
        label: 'Lost money',
        example: 'Comes in ashamed — "I lost €200".',
        parentResponse:
          '"I\'m sorry. That\'s an expensive but real economics lesson. Sit down — we\'ll unpack what happened so you know what to do differently. I\'m not paying it for you, but we learn together."',
        avoid: 'Covering the loss silently. They\'ll learn "parents bail me out" instead of learning risk.',
      },
      {
        label: 'Pump & dump / meme coins',
        example: 'Uses sites like pump.fun, buys tokens from ads.',
        parentResponse:
          '"I want you to know: that\'s where people like you are the product. Token creators sell you something that\'ll be worth zero in 3 days. Deal — show me any next buy before you click."',
        avoid: 'Total crypto ban. You can forbid — but you won\'t teach them to distinguish.',
      },
      {
        label: 'Scam',
        example: 'Someone online "helps" with investing, asks for a transfer to an unknown account.',
        parentResponse:
          '"Stop. That\'s a scam, not an investment. Now: nothing more goes out, we block the person, report to the bank and to the police. You\'re not dumb — they are professional liars."',
        avoid: 'Yelling. The victim already feels ashamed; yelling deepens it.',
      },
    ],
    redFlags: [
      'Hours of trading-TikTok watching with racing heart / waking up at night to check.',
      'Selling belongings to fund "investments".',
      'Taking a loan (from a friend, sibling, or an app) for crypto.',
      'Contact with an unknown person who "teaches trading".',
    ],
    followUp: [
      'Set a weekly cap on the amount they can move.',
      'Open a savings account together with a visible interest rate — 5% at a bank, not "100x in a week".',
      'Recommend realistic content: a local finance author, ETF basics.',
      'If there\'s already a serious loss — do not hide it from the other parent; it\'s a family matter.',
    ],
  },

  {
    key: 'scam_phishing',
    label: 'Scam & phishing',
    icon: '🎣',
    why: '"Free Robux, V-Bucks, Nitro" are the most popular bait for kids. They lose not only their own accounts, but also parents\' saved cards.',
    opening:
      '"A \'free Robux\' page got blocked. Not raising an alarm — I want you to know how it actually works. Okay?"',
    pitfalls: [
      'Don\'t say "you\'re too smart to fall for it". These pages work because they target emotions, not logic.',
      'Don\'t mock after the fact. Shame shuts down future reporting.',
      'Don\'t ignore the signal — if they clicked once, they\'ll likely click again.',
    ],
    ageNotes: {
      younger: 'Simple: "No one online gives anything for free. If someone promises — they want something from you. Always show me before you click."',
      tween: 'Be concrete: "See, this looks like a Microsoft page. But in the address bar it says r-n-i-c-r-o-s-o-f-t — small r and n, not m. That is how it looks."',
      teen: 'Adult-to-adult: "Scammers don\'t go after the stupid — they go after the fast. Tired, rushed, emotional. Best rule: slow down before clicking."',
    },
    reactions: [
      {
        label: '"I knew it was a scam"',
        example: 'Plays expert: "I was just checking what it looks like".',
        parentResponse:
          '"Cool. Show me how you spotted it — I want to make sure you know the signs. The next bait will be better made."',
        avoid: 'Assuming they know automatically. A knowledge check beats a guess.',
      },
      {
        label: 'Clicked, embarrassed',
        example: 'Admits after — "I gave my login because they promised Robux".',
        parentResponse:
          '"Thanks for telling me. Now, fast: change password, enable two-factor, check what\'s missing. Calm — happens to adults too."',
        avoid: 'The "I told you so" lecture. Priority is damage control, not venting.',
      },
      {
        label: 'Parent\'s card gone',
        example: 'In a game app, your card shows purchases you didn\'t make.',
        parentResponse:
          '"You\'re not in trouble for trusting. You\'re in a conversation about how it happened and what we do next. I\'m calling the bank, and we file the report together."',
        avoid: 'Blaming the child for the financial loss. The system had no block.',
      },
      {
        label: 'Denial',
        example: '"I didn\'t click, the app did itself."',
        parentResponse:
          '"I\'m showing you something got installed. Not going into who\'s at fault — important that we fix it. Maybe it was a trick, maybe not — we\'ll check."',
        avoid: 'Interrogation until they confess. Fix first, talk after.',
      },
      {
        label: 'Friend got scammed',
        example: 'Tells you about a friend who lost an account or money.',
        parentResponse:
          '"Oh no. Good you know. Ask if her parents already know — important to block the card if payments were involved. You can help her — here are concrete steps."',
        avoid: 'Brushing it off. This is a chance for your kid to learn to respond before they\'re next.',
      },
    ],
    redFlags: [
      'Strange SMS from "courier" / "bank" / "Netflix" with a link.',
      'Kid searching for "free stuff online" — pattern, not a one-off.',
      'Changed payment method in App Store / Google Play.',
      'Contact in game apps with strangers "giving crates" or "helping with trading".',
    ],
    followUp: [
      'Enable two-factor auth on every account — everywhere possible.',
      'Remove saved cards from gaming/app-store accounts — every purchase asks for a password.',
      'If bank details were shared / money transferred — report to the bank and to your national cybercrime unit.',
      'Agree on a rule: "Never a link from an SMS — always type the site manually."',
    ],
  },
]
