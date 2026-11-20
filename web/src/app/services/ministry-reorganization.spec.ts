import { default as data } from './data.json';

describe('2026 ministry reorganization reference data', () => {
  const ministries = data.referenceData.ministries;
  const ministryByCode = (code: string) => ministries.find((ministry) => ministry.code === code);

  it('uses the new ministry names and retains codes where required', () => {
    const renamed = [
      ['PSE', 'Post-Secondary Education and Labour'],
      ['AGR', 'Agriculture'],
      ['CITZ', "Citizens' Services and Technology"],
      ['EDT', 'Economic Development and Tourism'],
      ['ENV', 'Environment'],
      ['MSD', 'Social Development'],
      ['TRAN', 'Transportation and Infrastructure'],
      ['WLR', 'Waters, Land and Natural Resource Operations']
    ];

    renamed.forEach(([code, name]) => {
      const ministry = ministryByCode(code);
      expect(ministry).toBeDefined();
      expect(ministry && ministry.name).toBe(name);
      expect(ministry && ministry.publicBody).toBe(name);
    });
  });

  it('preserves existing ministry codes and lookup keys', () => {
    const preserved = [
      ['CITZ', 'CITZ'],
      ['TRAN', 'TRAN'],
      ['PSSG', 'PSSG'],
      ['ENV', 'MOE']
    ];
    preserved.forEach(([code, key]) => {
      const ministry = ministryByCode(code);
      expect(ministry && ministry.key).toBe(key);
    });
  });

  it('uses EDT, EMP and LHS as the new codes and keys', () => {
    expect(ministryByCode('EDT')).toEqual(jasmine.objectContaining({
      code: 'EDT',
      key: 'EDT',
      name: 'Economic Development and Tourism',
      publicBody: 'Economic Development and Tourism'
    }));
    expect(ministryByCode('EMP')).toEqual(jasmine.objectContaining({
      code: 'EMP',
      key: 'EMP',
      name: 'Energy, Mines and Petroleum Resources',
      publicBody: 'Energy, Mines and Petroleum Resources'
    }));
    expect(ministryByCode('LHS')).toEqual(jasmine.objectContaining({
      code: 'LHS',
      key: 'LHS',
      name: 'Local Government, Housing, Sport and Culture',
      publicBody: 'Local Government, Housing, Sport and Culture'
    }));
    ['ECS', 'HSG', 'JED'].forEach((code) => expect(ministryByCode(code)).toBeUndefined());
  });

  it('does not offer the five discontinued ministries', () => {
    ['EMC', 'MCM', 'LBR', 'TACS', 'INF'].forEach((code) => {
      expect(ministryByCode(code)).toBeUndefined();
    });
    expect(ministries.length).toBe(23);
  });

  it('keeps the Environmental Assessment Office associated with Environment', () => {
    const environment = ministryByCode('ENV');
    const eao = ministryByCode('EAO');
    expect(environment && environment.key).toBe('MOE');
    expect(eao && eao.name).toBe('Environmental Assessment Office');
    expect(eao && eao.publicBody).toBe('Environment');
  });
});
