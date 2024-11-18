export class Ms {
  static second = (count = 1) => count * 1000;
  static minute = (count = 1) => count * 1000 * 60;
  static hour = (count = 1) => count * 1000 * 60 * 60;
  static day = (count = 1) => count * 1000 * 60 * 60 * 24;
}
