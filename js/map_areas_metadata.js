

let area_transfer_points = {
    'ancient_forest_area1': {
        0: [10, 420, 'arrow_left', 'ancient_forest_village'],
        1: [590, 335, 'arrow_right', 'open_fields_area13'],
    },
    'ancient_forest_village': {
        0: [620, 401, 'arrow_right', 'ancient_forest_area1'],
        1: [2, 165, 'arrow_left', 'ancient_forest_area2'],
        2: [2, 600, 'arrow_left', 'ancient_forest_area3'],
    },
    'ancient_forest_area2': {
        0: [628,  740, 'arrow_right', 'ancient_forest_village'],
        // TODO 1: [2, 170, 'arrow_left', 'ancient_forest_elder_cave'],
        2: [244, 980, 'arrow_down', 'ancient_forest_area3'],
    },
    'ancient_forest_area3': {
        0: [634,  210, 'arrow_right', 'ancient_forest_village'],
        // TODO 1: [2, 170, 'arrow_left', 'ancient_forest_elder_cave'],
        2: [234, 16, 'arrow_up', 'ancient_forest_area2'],
    },
    'open_fields_area13': {
        0: [2,  455, 'arrow_left', 'ancient_forest_area1'],
        1: [300,  16, 'arrow_up', 'open_fields_area12'],
        2: [300, 900, 'arrow_down', 'open_fields_area14'],
    },
    'open_fields_area14': {
        0: [2,  400, 'arrow_left', 'open_fields_area13'],
        1: [580, 400, 'arrow_right', 'open_fields_area1'],
    },
    'open_fields_area1': {
        0: [2,  400, 'arrow_left', 'open_fields_area14'],
        1: [580, 400, 'arrow_right', 'open_fields_area2'],
        2: [300, 16, 'arrow_up', 'citadel_south_area'],
    },
    'open_fields_area2': {
        0: [2,  450, 'arrow_left', 'open_fields_area1'],
        1: [590, 450, 'arrow_right', 'open_fields_area3'],
    },
    'open_fields_area3': {
        0: [2,  458, 'arrow_left', 'open_fields_area2'],
        1: [314, 10, 'arrow_up', 'open_fields_area4'],
    },
    'open_fields_area4': {
        0: [273,  10, 'arrow_up', 'open_fields_area5'],
        1: [273, 890, 'arrow_down', 'open_fields_area3'],
    },
    'open_fields_area5': {
        0: [279,  10, 'arrow_up', 'open_fields_area6'],
        1: [279, 900, 'arrow_down', 'open_fields_area4'],
        2: [2, 500, 'arrow_left', 'citadel_east_area'],
    },
    'open_fields_area6': {
        0: [2,  450, 'arrow_left', 'open_fields_area7'],
        1: [273, 890, 'arrow_down', 'open_fields_area5'],
    },
    'open_fields_area7': {
        0: [2,  450, 'arrow_left', 'open_fields_area8'],
        1: [590, 450, 'arrow_right', 'open_fields_area6'],
    },
    'open_fields_area8': {
        0: [2,  444, 'arrow_left', 'open_fields_area9'],
        1: [540, 444, 'arrow_right', 'open_fields_area7'],
        2: [245, 890, 'arrow_down', 'citadel_north_area'],
    },
    'open_fields_area9': {
        0: [2,  445, 'arrow_left', 'open_fields_area10'],
        1: [569, 445, 'arrow_right', 'open_fields_area8'],
    },
    'open_fields_area10': {
        0: [305,  900, 'arrow_down', 'open_fields_area11'],
        1: [590, 450, 'arrow_right', 'open_fields_area9'],
    },
    'open_fields_area11': {
        0: [565,  400, 'arrow_right', 'citadel_west_area'],
        1: [300, 10, 'arrow_up', 'open_fields_area10'],
        2: [300, 900, 'arrow_down', 'open_fields_area12'],
    },
    'open_fields_area12': {
        0: [300,  10, 'arrow_up', 'open_fields_area11'],
        1: [300, 900, 'arrow_down', 'open_fields_area13'],
    },
    'citadel_south_area': {
        0: [300,  900, 'arrow_down', 'open_fields_area1'],
        1: [300, 16, 'arrow_up', 'citadel_central_area'],
    },
    'citadel_central_area': {
        0: [380,  900, 'arrow_down', 'citadel_south_area'],
        1: [380, 16, 'arrow_up', 'citadel_north_area'],
        2: [2,  470, 'arrow_left', 'citadel_west_area'],
        3: [720, 460, 'arrow_right', 'citadel_east_area'],
    },
    'citadel_north_area': {
        0: [300,  900, 'arrow_down', 'citadel_central_area'],
        1: [300, 16, 'arrow_up', 'open_fields_area8'],
    },
    'citadel_east_area': {
        0: [730,  470, 'arrow_right', 'open_fields_area5'],
        1: [2, 475, 'arrow_left', 'citadel_central_area'],
    },
    'citadel_west_area': {
        0: [2,  470, 'arrow_left', 'open_fields_area11'],
        1: [720, 475, 'arrow_right', 'citadel_central_area'],
    },
}
