class Numeric {
  
  static random_integer = (min_value = 0, max_value = 1) => {
    return Math.floor(Math.random() * (max_value - min_value + 1)) + min_value;
  }
  static random_float = (min_value = 0, max_value = 1) => {
    return Math.random() * (max_value - min_value) + min_value;
  }

  //Gauss normal distribution function
  static gauss = (a, b, c, x) => {
      let x_minus_b_quadratic = Math.pow(x - b, 2)
      let two_times_quadratic_c = 2 * Math.pow(c, 2)
      return a * Math.pow(Math.E, -x_minus_b_quadratic / two_times_quadratic_c)
  }
  //Gauss for a custom domain of values for variable c (c as a function of x)
  static gauss_domain_c = (a, b, x, domain = false) => {
      if(!domain) domain = [1, 4, 8, 11, 12, 14, 15, 16, 16, 18, 18, 18, 18, 18, 19, 19, 18, 18, 18, 18, 17, 16, 16, 15, 14, 13, 12, 10, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9]
      return gauss(a, b, domain[x], x)
  }
}