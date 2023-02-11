

let area_transfer_points = {
    'ancient_forest_area1': {
        0: [2, 550, 'arrow_left', 'ancient_forest_village'],
        1: [624, 470, 'arrow_right', 'open_fields_area13'],
    },
    'ancient_forest_village': {
        0: [634, 550, 'arrow_right', 'ancient_forest_area1'],
        1: [2, 230, 'arrow_left', 'ancient_forest_area2'],
        2: [2, 810, 'arrow_left', 'ancient_forest_area3'],
    },
    'ancient_forest_area2': {
        0: [628,  710, 'arrow_right', 'ancient_forest_village'],
        // TODO 1: [2, 170, 'arrow_left', 'ancient_forest_elder_cave'],
        2: [244, 960, 'arrow_down', 'ancient_forest_area3'],
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
    'citadel_south_area': {
        0: [300,  900, 'arrow_down', 'open_fields_area1'],
        1: [300, 16, 'arrow_up', 'citadel_central_area'],
    },
    'citadel_central_area': {
        0: [300,  900, 'arrow_down', 'citadel_south_area'],
        1: [300, 16, 'arrow_up', 'citadel_north_area'],
    },
    'citadel_north_area': {
        0: [300,  900, 'arrow_down', 'citadel_central_area'],
        // 1: [300, 16, 'arrow_up', 'citadel_north_area'],
    },
}
