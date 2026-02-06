class Pregnancy {
  static max_duration_weeks = 1
  //Viability constants
  static viability_gt_70 = 1
  static viability_62_69 = 0.9
  static viability_54_61 = 0.81
  static viability_46_53 = 0.72
  static viability_38_45 = 0.63
  static viability_30_37 = 0.54
  static viability_22_29 = 0.45
  static viability_14_21 = 0.36
  static viability_6_13 = 0.27
  static viability_lt_6 = 0.18
  static viability = (fertility_avg) => {
    return fertility_avg >= 70 
            ? Pregnancy.viability_gt_70
            : (62 <= fertility_avg && fertility_avg < 70
                ? Pregnancy.viability_62_69
                : (54 <= fertility_avg && fertility_avg < 62
                    ? Pregnancy.viability_54_61
                    : (46 <= fertility_avg && fertility_avg < 54
                        ? Pregnancy.viability_46_53
                        : (38 <= fertility_avg && fertility_avg < 46
                            ? Pregnancy.viability_38_45
                            : (30 <= fertility_avg && fertility_avg < 38
                                ? Pregnancy.viability_30_37
                                : (22 <= fertility_avg && fertility_avg < 30
                                    ? Pregnancy.viability_22_29
                                    : (14 <= fertility_avg && fertility_avg < 22
                                        ? Pregnancy.viability_14_21
                                        : (6 <= fertility_avg && fertility_avg < 14
                                            ? Pregnancy.viability_6_13
                                            : Pregnancy.viability_lt_6
                                        )
                                    )
                                )
                            )
                        )
                    )
                )
            )
  }

  constructor(woman, man) {
    this.id = colony.get_next_pregnancy_id()
    this.mother = woman
    this.father = man
    this.fertility_sum = woman.fertility.value + man.fertility.value
    this.remaining_weeks = Math.max(1, Pregnancy.max_duration_weeks - Numeric.random_integer(0, 4))
    this.children_amount = this.get_amount_of_babies()
    //Reduce mother and father fertility
    this.mother.fertility.value = Math.max(0, this.mother.fertility.value - 1)
    this.father.fertility.value = Math.max(0, this.father.fertility.value - 1)
  }

  get_amount_of_babies = () => {
    let random_value = Math.random()
    if(this.fertility_sum >= 150){
        return random_value <= 0.45 ? 1 : (random_value <= 0.45 + 0.33 ? 2 : 3)
    }
    if(120 <= this.fertility_sum && this.fertility_sum < 150){
        return random_value <= 0.52 ? 1 : (random_value <= 0.52 + 0.3 ? 2 : 3)
    }
    if(90 <= this.fertility_sum && this.fertility_sum < 120){
        return random_value <= 0.6 ? 1 : (random_value <= 0.6 + 0.25 ? 2 : 3)
    }
    if(50 <= this.fertility_sum && this.fertility_sum < 90){
        return random_value <= 0.7 ? 1 : (random_value <= 0.7 + 0.2 ? 2 : 3)
    }
    if(25 <= this.fertility_sum && this.fertility_sum < 50){
        return random_value <= 0.8 ? 1 : (random_value <= 0.8 + 0.13 ? 2 : 3)
    }
    if(this.fertility_sum < 25){
        return random_value <= 0.9 ? 1 : (random_value <= 0.9 + 0.07 ? 2 : 3)
    }
  }

  draw = () => {
    //Update mother status in citizen's panel.
    document.getElementById(`citizen-${this.mother.id}-status`).setAttribute("data-status", "pregnant")
    document.getElementById(`citizen-${this.mother.id}-status`).innerHTML = translate(language, "pregnant")
    //Show remaining weeks next to status.
    document.getElementById(`citizen-${this.mother.id}-pregnancy-weeks`).innerHTML = this.remaining_weeks.toString()
    document.getElementById(`citizen-${this.mother.id}-status`).closest("div").querySelectorAll(".pregnant.hidden").forEach((elem) => {
        elem.classList.remove("hidden")
    })
  }
}