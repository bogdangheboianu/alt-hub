nest g mo "$1" &&
  cd ./src/"$1" || exit &&
  mkdir commands &&
  mkdir commands/impl &&
  mkdir commands/handlers &&
  mkdir constants &&
  mkdir controllers &&
  mkdir dtos &&
  mkdir entities &&
  mkdir enums &&
  mkdir events &&
  mkdir events/impl &&
  mkdir exceptions &&
  mkdir interfaces &&
  mkdir mappers &&
  mkdir models &&
  mkdir queries &&
  mkdir queries/impl &&
  mkdir queries/handlers &&
  mkdir repositories &&
  mkdir services &&
  mkdir types
