export const applyFixtures = async (
  fixtures: any[],
  prismaClientEntity: any,
) => {
  for (let i = 0; i < fixtures.length; i++) {
    await prismaClientEntity.create({
      data: fixtures[i],
    });
  }
};
