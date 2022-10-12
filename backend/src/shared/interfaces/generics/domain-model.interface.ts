export interface IDomainModel<Model, Entity> {
    equals(to: Model): boolean;

    toEntity(): Entity;
}
